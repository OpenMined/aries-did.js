import * as Koa from 'koa';
import * as Router from 'koa-router';
import emitter from '../agent-emitter/agent-emitter';
import { ConnectionState } from 'src/app/core/interfaces/connection.interface';

export interface IConnectionHookResponse {
  updated_at: 'string';
  their_label: 'string';
  initiator: 'string';
  accept: 'string';
  invitation_mode: 'string';
  my_did: 'string';
  request_id: 'string';
  invitation_key: 'string';
  connection_id: 'string';
  routing_state: 'string';
  state: ConnectionState;
  created_at: 'string';
}
const routerOpts: Router.IRouterOptions = {
  prefix: '/topic/connections'
};

const router: Router = new Router(routerOpts);

router.post('/', async (ctx: Koa.Context) => {
  ctx.app.emit('connections', ctx.request.body);
  return (ctx.body = 'doing hook things');
});

export default router;
