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
    const connections = await ctrl.connection.getConnections({
      state: 'active'
    });
    let proofs = await ctrl.proof.records();
    console.log('connections', connections);
    if (Array.isArray(connections)) {
      let mappedProofs = connections.map(itm => {
        let mappedProof = {
          label: itm.their_label,
          did: itm.their_did,
          proofs: proofs
            .filter(proof => itm.connection_id === proof.connection_id)
            .map(proof => {
              return {
                _id: proof.presentation_exchange_id,
                updated: proof.updated_at,
                created: proof.created_at,
                state: proof.state,
                connectionId: proof.connection_id
              };
            })
        };
        return mappedProof;
      });
      return (ctx.body = mappedProofs);
    }
    return (ctx.body = []);
  } catch (err) {
    return ctx.throw(500, 'internal server error');
  }
});

router.post('/', async (ctx: Koa.Context) => {
  let proof = ctx.request.body;
  try {
    const proofRequest = await ctrl.proof.buildProofRequest(
      proof.schemaDef,
      proof.connectionId,
      proof.comment,
      proof.names
    );
    const res = await ctrl.proof.sendProofRequest(proofRequest);

    ctx.status = 201;
    return (ctx.body = res);
  } catch (err) {
    ctx.throw(500, err.message);
  }
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
    console.log('the id', id);
    let proof = await ctrl.proof.getRecordById(id);
    if (!proof) return ctx.throw(404);
  } catch (err) {
    return ctx.throw(err);
  }
});

router.delete('/:id', async (ctx: Koa.Context) => {
  let id = ctx.params.id;

  try {
    let res = await ctrl.proof.removeProof(id);

    return (ctx.body = res);
  } catch {
    return ctx.throw(500);
  }
});

export default router;
