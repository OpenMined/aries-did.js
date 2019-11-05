import * as Koa from 'koa';
import * as Router from 'koa-router';
import emitter from '../agent-emitter/agent-emitter';

const routerOpts: Router.IRouterOptions = {
  prefix: '/topic/connections'
};

const router: Router = new Router(routerOpts);

router.post('/', async (ctx: Koa.Context) => {
  emitter.emit('connection', { ...ctx.request.body, ip: ctx.request.origin });
  return (ctx.body = 'doing hook things');
});

export default router;
