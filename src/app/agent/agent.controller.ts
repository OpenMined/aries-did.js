import * as Koa from 'koa';
import * as Router from 'koa-router';
import { AgentService } from './agent.service';

const routerOpts: Router.IRouterOptions = {
  prefix: '/webhooks'
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = 'GET ALL';
});

router.post('invitation', '/', async (ctx: Koa.Context) => {
  const agentSvc = new AgentService();
  // const res = agentSvc.createInvitation();
  // ctx.body = res;
  return ctx;
});

export default router;
