import * as Koa from 'koa';
import * as Router from 'koa-router';

import client from '../client';

const ctrl = client;

export interface IMessage {
  _id: string;
  state: string;
  initiator: string;
  connectionId?: string;
}

export interface IMessages {
  connections: IMessage[];
  proofs: IMessage[];
  issues: IMessage[];
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/messages'
};

const router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  let results: IMessages = { connections: [], proofs: [], issues: [] };

  let connections = await ctrl.connection.getConnections();
  if (Array.isArray(connections)) {
    const connectionMssgs = connections
      .filter(itm => itm.state !== 'active')
      .map(itm => {
        return {
          _id: itm.connection_id,
          state: itm.state,
          initiator: itm.initiator
        };
      });
    results.connections = connectionMssgs;
  }
  let issues = await ctrl.issue.records();
  let issueMssgs = issues
    .filter(itm => itm.state !== 'active')
    .map(itm => {
      return {
        _id: itm.credential_exchange_id,
        state: itm.state,
        connectionId: itm.connection_id,
        initiator: itm.initiator
      };
    });

  results.issues = issueMssgs;
  let proofs = await ctrl.proof.records();
  let proofMssgs = proofs
    .filter(itm => itm.state !== 'active')
    .map(itm => {
      return {
        _id: itm.presentation_exchange_id,
        connectionId: itm.connection_id,
        state: itm.state,
        initiator: itm.initiator
      };
    });
  results.proofs = proofMssgs;
  return (ctx.body = results);
});

export default router;
