import * as Koa from 'koa';
import * as Router from 'koa-router';

import { CredDefService } from './cred-def.service';

import client from '../client';
import DB from '../db';

const db = DB;

const ctrl = client;

const credDefSvc = new CredDefService(ctrl.schema, ctrl.credDef);

export interface ICredDef {
  _id: string;
  name: string;
  version: string;
  attributes: string;
  schema_id: string;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/credential-definitions'
};

const router = new Router(routerOpts);

router.post('/', async (ctx: Koa.Context) => {
  let schema = ctx.request.body;
  try {
    const res = await credDefSvc.createCredDef(schema);
    console.log('schema response', res);
    let credDef = { ...schema, _id: res.id };
    await db.insertRecord({ prefix: 'cdef', record: credDef });
    return (ctx.body = { _id: res.id });
  } catch (err) {
    if (err.name === 'conflict') {
      return ctx.body;
    }
    ctx.throw(400, err);
  }
});

router.get('/', async (ctx: Koa.Context) => {
  try {
    let credDefs = (await db.getRecords({ prefix: 'cdef' })) as any[];
    return (ctx.body = credDefs.map(itm => {
      let { _id, attributes, schema_name: name, schema_version: version } = itm;
      return { _id, attributes, name, version };
    }));
  } catch (err) {
    return ctx.throw(500);
  }
});

router.get('/:id', async (ctx: Koa.Context) => {
  try {
    const records = (await db.getRecords({ prefix: 'cdef' })) as any[];
    return (ctx.body = records
      .map(itm => {
        let {
          _id,
          attributes,
          schema_name: name,
          schema_version: version
        } = itm;
        return { _id, attributes, name, version };
      })
      .filter(itm => itm._id === ctx.params.id)[0]);
  } catch (err) {
    ctx.throw(err);
  }
});

router.delete('/:id', async (ctx: Koa.Context) => {
  console.log(ctx.params.id);
  try {
    return (ctx.body = await db.removeRecord({ _id: ctx.params.id }));
  } catch (err) {
    ctx.throw(err);
  }
});

export default router;
