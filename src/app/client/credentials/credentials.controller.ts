import * as Koa from 'koa';
import * as Router from 'koa-router';

import client from '../client';
import DB from '../db';
import { IConnectionsResult } from 'src/app/core/interfaces/connection.interface';

const ctrl = client;
const db = DB;

const routerOpts: Router.IRouterOptions = {
  prefix: '/credentials'
};

const router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  try {
    const connections = (await ctrl.connection.getConnections({
      state: 'active'
    })) as IConnectionsResult;
    const credDefs = await db.allDocs({ include_docs: true });

    const issues = await ctrl.issue.records();

    const credlist = issues
      .filter(itm => itm.state === 'stored')
      .map(itm => {
        return { _id: itm.connection_id };
      });

    const credSet = Array.from(new Set(credlist));
    let results = credSet.map(async connectionId => {
      const id = connectionId._id;
      return ctrl.connection
        .getConnections({}, id)
        .then(res => {
          if (!Array.isArray(res)) {
            return {
              _id: id,
              name: res.their_label,
              did: res.their_did,
              credentials: issues
                .filter(
                  issue =>
                    issue.connection_id === id && issue.initiator === 'external'
                )
                .map(itm => {
                  return {
                    _id: itm.credential_exchange_id,
                    label: res.their_label,
                    state: itm.state,
                    proposal: itm.proposal,
                    created: itm.created_at,
                    updated: itm.updated_at,
                    did: res.their_did,
                    credId: itm.credential_id,
                    credDefId: itm.credential_definition_id,
                    initiator: itm.initiator,
                    schema: credDefs.rows.filter(
                      doc => doc.id === itm.credential_definition_id
                    )[0].doc
                  };
                })
            };
          }
        })
        .then(itm => itm);
    });
    return (ctx.body = await Promise.all(results));
  } catch (err) {
    ctx.throw(500, err.message);
  }
});

router.get('/:id', async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  const attributes = (attrs: any) => {
    const arr = [];
    for (let key in attrs) {
      arr.push({ key: key, value: attrs[key] });
    }
    return arr;
  };
  try {
    const cred = await ctrl.issue.records();
    const filtered = cred.filter(cred => cred.credential_exchange_id === id)[0];
    const doc = await db.get(filtered.credential_definition_id);
    const connection = (await ctrl.connection.getConnections(
      {},
      filtered.connection_id
    )) as IConnectionsResult;
    return (ctx.body = {
      _id: filtered.credential_exchange_id,
      credId: filtered.credential_id,
      credDefId: filtered.credential_definition_id,
      state: filtered.state,
      credential: filtered.credential,
      values: attributes(filtered.credential.attrs),
      proposal: filtered.proposal,
      created: filtered.created_at,
      updated: filtered.updated_at,
      label: connection.their_label,
      did: connection.their_did,
      schema: doc
    });
  } catch (err) {
    return ctx.throw(err);
  }
});

router.post('/', async (ctx: Koa.Context) => {});

export default router;
