import * as Koa from 'koa';
import * as Router from 'koa-router';

import client from '../client';

const agentController = client;

const routerOpts: Router.IRouterOptions = {
  prefix: '/credentials'
};

const router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  try {
    let res = await agentController.cred.records();
    return (ctx.body = res);
  } catch (err) {
    ctx.throw(500, err.message);
  }
});

router.post('/', async (ctx: Koa.Context) => {});

export default router;
