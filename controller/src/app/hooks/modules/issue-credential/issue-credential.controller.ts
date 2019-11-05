import * as Koa from 'koa';
import * as Router from 'koa-router';
import emitter from '../agent-emitter/agent-emitter';

const routerOpts: Router.IRouterOptions = {
  prefix: '/topic/issue_credential'
};

const router: Router = new Router(routerOpts);

router.post('/', async (ctx: Koa.Context) => {
  emitter.emit('proof', { ...ctx.request.body, ip: ctx.request.origin });
  return (ctx.body = 'doing hook things');
});

export default router;
