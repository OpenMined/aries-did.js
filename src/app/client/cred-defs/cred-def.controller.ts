import * as Koa from 'koa';
import * as Router from 'koa-router';

import { CredDefService } from './cred-def.service';

import client from '../client';
import DB from '../db';

const db = DB;

const ctrl = client;

const credDefSvc = new CredDefService(ctrl.schema, ctrl.credDef);

const routerOpts: Router.IRouterOptions = {
  prefix: '/credential-definitions'
};

const router = new Router(routerOpts);

router.post('/', async (ctx: Koa.Context) => {
  let schema = ctx.request.body;
  try {
    const res = await credDefSvc.createCredDef(schema);
    let _id = res.id;
    ctx.body = res;
    let dbRecord = await db.put({
      _id,
      name: schema.schema_name,
      version: schema.schema_version,
      attributes: schema.attributes,
      schema_id: res.schemaId
    });
    return (ctx.body = {
      id: dbRecord.id
    });
  } catch (err) {
    if (err.name === 'conflict') {
      return ctx.body;
    }
    ctx.throw(400, err);
  }
});

router.get('/', async (ctx: Koa.Context) => {
  try {
    let records = await db.allDocs({ include_docs: true });
    return (ctx.body = records.rows.map(itm => itm.doc));
  } catch (err) {
    return ctx.throw(500);
  }
});

router.get('/:id', async (ctx: Koa.Context) => {
  try {
    let record = await db.get(ctx.params.id);
    console.log('the record', record);
    if (record) return (ctx.body = record);
  } catch (err) {
    ctx.throw(err);
  }
});

router.delete('/:id', async (ctx: Koa.Context) => {
  try {
    let doc = await db.get(ctx.params.id);
    return (ctx.body = await db.remove(doc));
  } catch (err) {
    ctx.throw(err);
  }
});

export default router;
