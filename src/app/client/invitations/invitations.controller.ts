import * as Koa from 'koa';
import * as Router from 'koa-router';
import { InvitationService } from './invitations.service';
import AgentConfig from '../../../app/config';
import { Connection } from '../../../app/agent/modules/connection/connection.model';
import * as cluster from 'cluster';
import client from '../../client/client';

const agentConfig = new AgentConfig();
const connection = new Connection(agentConfig.agentUrl);
const invitationSvc = new InvitationService(connection);

const routerOpts: Router.IRouterOptions = {
  prefix: '/invitations'
};

const router: Router = new Router(routerOpts);

const invitationResponseKeys = [
  'connection_id',
  'invitation',
  'invitation_url'
];
const invitationKeys = ['@type', 'recipientkeys', 'label', 'serviceEndpoint'];

let clientApp = client;

if (cluster.isWorker) {
  console.log('worker cluster', cluster.worker.id);
}
/* 
  get all of my external invitations
  parameters: state, initiator
*/

router.get('/', async (ctx: Koa.Context) => {
  // if (!cluster.isMaster) {
  // }
  const params = ctx.query;
  try {
    const res = await invitationSvc.getInvitations(params);
    return (ctx.body = res);
  } catch (err) {
    ctx.throw(400, err.message);
  }
});

/*
  Create an invitation or respond to an invitation that has been sent to the
  client.
  Set the accept value to true to accept the invitation in the query params
  and include a body with the correct format
*/
router.post('/', async (ctx: Koa.Context) => {
  const params = ctx.query;
  const keys = Object.keys(params);
  console.log('cluster id', cluster.worker.id);
  console.log(clientApp);

  if (keys.some(itm => itm === 'accept')) {
    const invite = ctx.request.body;
    try {
      const req = await invitationSvc.acceptInvitation(invite);
      ctx.body = req;
    } catch (err) {
      ctx.throw(400, 'invalid request');
    }
    return ctx.body;
  } else {
    // try {
    //   const invite = await invitationSvc.createInvitation();
    //   const formatInvite = {
    //     type: invite['@type'],
    //     id: invite['@id'],
    //     serviceEndpoint: invite.serviceEndpoint,
    //     label: invite.label,
    //     recipientkeys: invite.recipientkeys
    //   };
    //   ctx.body = formatInvite;
    // } catch (err) {
    //   ctx.status = 500;
    //   ctx.throw('invitation failed to create on the server');
    // }
  }
});

router.post('/accept', async ctx => {
  const invite = ctx.body;
});

export default router;
