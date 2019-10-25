import * as Koa from 'koa';
import * as Router from 'koa-router';
import client from '../client';

const routerOpts = {
  prefix: '/profile'
};

const router = new Router(routerOpts);

const ctrl = client;

router.get('/', async (ctx: Koa.Context) => {
  let count = 0;

  try {
    let invite = await ctrl.connection.createInvitation();
    // let connection = await ctrl.connection.getConnections({}, invite['@id']);

    let connections = await ctrl.connection.getConnections();

    if (Array.isArray(connections)) {
      const connectionMssgs = connections.filter(
        itm =>
          itm.state !== 'active' &&
          (itm.state !== 'invitation' && itm.initiator === 'self')
      );

      count += connectionMssgs.length;
    }
    let issues = await ctrl.issue.records();
    let issueMssgs = issues.filter(itm => itm.state !== 'stored');

    let proofs = await ctrl.proof.records();
    let proofMssgs = proofs.filter(itm => itm.state !== 'active');

    count += issueMssgs.length;
    count += proofMssgs.length;
    const wallet = await ctrl.wallet.publicDid();
    console.log('the wallet', wallet);
    const creds = await ctrl.cred.records();
    // if (!Array.isArray(connection)) {
    return (ctx.body = {
      label: invite.label,
      did: wallet.result.did,
      messageCount: count,
      credsCount: creds.length
    });
    // }
  } catch (err) {
    ctx.throw(err.message, 500);
  }
});

export default router;
