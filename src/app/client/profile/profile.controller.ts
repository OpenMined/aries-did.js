import * as Koa from 'koa';
import * as Router from 'koa-router';
import client from '../client';
import { IConnectionsResult } from 'src/app/core/interfaces/connection.interface';

const routerOpts = {
  prefix: '/profile'
};

const router = new Router(routerOpts);

const ctrl = client;

router.get('/', async (ctx: Koa.Context) => {
  try {
    let connections = (await ctrl.connection.getConnections({
      state: 'active'
    })) as IConnectionsResult[];

    let issues = await ctrl.issue.records();

    let proofs = await ctrl.proof.records();

    const wallet = await ctrl.wallet.publicDid();
    const creds = await ctrl.cred.records();
    return (ctx.body = {
      did: wallet.result.did,
      label: wallet.result.label,
      issuesCount: issues.length,
      credsCount: creds.length,
      proofsCount: proofs.length,
      relCount: connections.length
    });
  } catch (err) {
    ctx.throw(err.message, 500);
  }
});

export default router;
