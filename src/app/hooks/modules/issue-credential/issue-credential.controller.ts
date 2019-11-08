import * as Koa from 'koa';
import * as Router from 'koa-router';

const routerOpts: Router.IRouterOptions = {
  prefix: '/connections'
};

const router: Router = new Router(routerOpts);

router.post('/', async (ctx: Koa.Context) => {
  console.log('doing hook things', ctx.request.body);
  return (ctx.body = 'doing hook things');
});

export default router;
