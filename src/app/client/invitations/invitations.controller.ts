import * as Koa from 'koa';
import * as Router from 'koa-router';
import client from '../../client/client';

const agent = client;

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

const ctrl = client;

/* 
  get all of my external invitations
  parameters: state, initiator
*/

router.get('/', async (ctx: Koa.Context) => {
  try {
    const res = await ctrl.connection.createInvitation();
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
  const invite = ctx.request.body;
  // console.log('the invite', invite);
  if (!invite) ctx.throw(400, 'invalid request');
  try {
    const req = await ctrl.connection.invitationResponse(invite);
    console.log('the result', req);
    return (ctx.body = req);
  } catch (err) {
    // console.log(err);
    ctx.throw(400, 'invalid request');
  }
  return ctx.body;
});

router.post('/accept', async ctx => {
  const invite = ctx.body;
});

export default router;
