import * as Koa from 'koa';
import * as Router from 'koa-router';
import client from '../client';

const ctrl = client;

const routerOpts: Router.IRouterOptions = {
  prefix: '/relationships'
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  try {
    const params = ctx.query;
    if (params.id) {
      const res = await ctrl.connection.getConnections(params, params.id);
      ctx.body = res;
    } else {
      const res = await ctrl.connection.getConnections(params);
      ctx.body = res;
    }
  } catch (err) {
    ctx.throw(400, 'failed to get relationships');
  }
});

router.post('/', async (ctx: Koa.Context) => {
  try {
    // const invite = await relationship.createInvitation();
    // ctx.body = invite;
    ctx.body = 'new relationship';
  } catch (err) {
    ctx.status = 500;
    ctx.throw('invitation failed to create on the server');
  }
});

router.get('/:id', async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  try {
    const relationship = await ctrl.connection.getConnections({}, id);
    console.log('single relationship', relationship);
    if (!relationship) return ctx.throw(404, 'not found');
    return (ctx.body = relationship);
  } catch (err) {
    return ctx.throw(500, err.message);
  }
});

router.post('/:id', async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  console.log('the id', id);
  try {
    let relationship = await ctrl.connection.getConnections({}, id);
    if (!Array.isArray(relationship)) {
      const state = relationship.state;
      if (state === 'response' || state === 'request') {
        await ctrl.connection.sendTrustPing(id);
        relationship = await ctrl.connection.getConnections({}, id);
        return (ctx.body = relationship);
      }
      return (ctx.body = relationship);
    } else {
      ctx.throw(404, 'not found');
    }
  } catch (err) {
    ctx.status = 500;
    ctx.throw('invitation failed to create on the server');
  }
});

export default router;
