import * as Koa from 'koa';
import * as Router from 'koa-router';

import client from '../client';

const ctrl = client;

export type MessagesType = 'proof' | 'issue' | 'connection';

export interface IMessage {
  _id: string;
  state: string;
  initiator: string;
  connectionId?: string;
  type: string;
  updated: Date;
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
  // let results: IMessages = { connections: [], proofs: [], issues: [] };
  let results: IMessage[] = [];
  let connections = await ctrl.connection.getConnections();
  if (Array.isArray(connections)) {
    const connectionMssgs = connections
      .filter(
        itm =>
          itm.state !== 'active' &&
          (itm.state !== 'invitation' && itm.initiator === 'self')
      )
      .map(itm => {
        return {
          _id: itm.connection_id,
          state: itm.state,
          initiator: itm.initiator,
          label: itm.their_label,
          updated: new Date(itm.updated_at),

          type: 'connections'
        };
      });
    results = [...connectionMssgs];
  }
  let issues = await ctrl.issue.records();
  let issueMssgs = issues
    .filter(itm => itm.state !== 'active' && itm.state !== 'stored')
    .map(itm => {
      return {
        _id: itm.credential_exchange_id,
        state: itm.state,
        connectionId: itm.connection_id,
        initiator: itm.initiator,
        updated: new Date(itm.updated_at),
        type: 'issues'
      };
    });

  results = [...results, ...issueMssgs];

  let proofs = await ctrl.proof.records();
  let proofMssgs = proofs
    .filter(itm => itm.state !== 'active' && itm.state !== 'stored')
    .map(itm => {
      return {
        _id: itm.presentation_exchange_id,
        connectionId: itm.connection_id,
        state: itm.state,
        initiator: itm.initiator,
        updated: new Date(itm.updated_at),
        type: 'proofs'
      };
    });
  results = [...results, ...proofMssgs];
  let sorted = results.sort(
    (a, b) => a.updated.valueOf() - b.updated.valueOf()
  );
  return (ctx.body = sorted);
});

export default router;
