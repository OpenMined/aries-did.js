import * as Koa from 'koa';
import * as Router from 'koa-router';
import client from '../client';

const ctrl = client;

const routerOpts: Router.IRouterOptions = {
  prefix: '/hooks'
};

const router: Router = new Router(routerOpts);

router.post('/', async (ctx: Koa.Context) => {
  console.log('doing hook things', ctx);
  return ctx.body = 'doing hook things'
});

router.put('/', async (ctx: Koa.Context) => {
  console.log('doing hook things', ctx);
  return ctx.body = 'doing hook things'
});


export default router;
