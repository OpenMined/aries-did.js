import * as Koa from 'koa';
import * as Router from 'koa-router';

import client from '../client';

const ctrl = client;

const routerOpts = {
  prefix: '/proofs'
};

const router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  try {
    let proofs = await ctrl.proof.records();
    return (ctx.body = proofs);
  } catch (err) {
    return ctx.throw(500, 'internal server error');
  }
});

router.post('/', async (ctx: Koa.Context) => {
  let proof = ctx.request.body;
});

router.get('/:id', async (ctx: Koa.Context) => {
  let id = ctx.params.id;
  try {
    let res = await ctrl.proof.records();
    let proof = res.filter(itm => itm.presentation_exchange_id === id);
    if (!proof) return ctx.throw(404);
    return (ctx.body = proof);
  } catch (err) {
    ctx.throw(500, 'internal server error');
  }
});

router.post('/:id', async (ctx: Koa.Context) => {
  let id = ctx.params.id;

  try {
  } catch (err) {}
});

export default router;
