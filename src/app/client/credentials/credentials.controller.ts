import * as Koa from 'koa';
import * as Router from 'koa-router';

import client from '../client';
import DB from '../db';

const ctrl = client;
const db = DB;

const routerOpts: Router.IRouterOptions = {
  prefix: '/credentials'
};

const router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  try {
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
              label: res.their_label,
              did: res.their_did,
              credentials: issues.filter(issue => issue.connection_id === id)
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

router.post('/', async (ctx: Koa.Context) => {});

export default router;
