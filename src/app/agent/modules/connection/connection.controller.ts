import * as Koa from 'koa';
import * as Router from 'koa-router';
import { ConnectionService } from './connection.service';

const routerOpts: Router.IRouterOptions = {
  prefix: '/connection'
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = 'GET ALL';
});

router.post('/invite', async (ctx: Koa.Context) => {
  const connectionSvc = new ConnectionService();
  // const res = agentSvc.createInvitation();
  // ctx.body = res;
  return ctx;
});

export default router;
