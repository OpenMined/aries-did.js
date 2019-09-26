import * as Koa from 'koa';
import * as Router from 'koa-router';
import { InvitationService } from './invitations.service';

const invitation = new InvitationService();

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

router.get('/', async (ctx: Koa.Context) => {
  const params = ctx.query;
  // console.log('ctx query');
  console.log(params);
  const res = await invitation.getInvitations(params);
  ctx.body = res;
});

router.post('/', async (ctx: Koa.Context) => {
  try {
    const invite = await invitation.createInvitation();
    ctx.body = invite;
  } catch (err) {
    ctx.status = 500;
    ctx.throw('invitation failed to create on the server');
  }
});

export default router;
