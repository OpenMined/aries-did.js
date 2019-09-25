import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Relationships } from './relationships.model';

const relationship = new Relationships();

const routerOpts: Router.IRouterOptions = {
  prefix: '/relationships'
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  const res = await relationship.getRelationships();
  ctx.body = res;
});

router.post('', '/', async (ctx: Koa.Context) => {
  // const agentSvc = new AgentService();
  // const res = agentSvc.createInvitation();
  // ctx.body = res;
  return ctx;
});

export default router;
