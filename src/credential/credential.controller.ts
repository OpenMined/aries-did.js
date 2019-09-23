import * as Koa from 'koa';
import * as Router from 'koa-router';

const routerOpts: Router.IRouterOptions = {
  prefix: '/credentials'
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = 'GET ALL';
});

router.get('/:credential_id', async (ctx: Koa.Context) => {
  ctx.body = 'GET SINGLE';
});

router.post('/', async (ctx: Koa.Context) => {
  ctx.body = 'POST';
});

router.delete('/:credential_id', async (ctx: Koa.Context) => {
  ctx.body = 'DELETE';
});

router.patch('/:credential_id', async (ctx: Koa.Context) => {
  ctx.body = 'PATCH';
});

export default router;
