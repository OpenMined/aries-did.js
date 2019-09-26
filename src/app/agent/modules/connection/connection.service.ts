import {
  IInvitationRequest,
  IInvitationRequestResponse
} from '../../../core/interfaces/invitation-request.interface';
import * as request from 'superagent';
import { MessageState } from '../../../core/interfaces/agent.interface';

const apiUrl = 'http://localhost:8051/';
const segment = 'connections/';

export type ConnectionInitiator = 'self' | 'external';

export interface IConnectionParams {
  alias?: string;
  initiator?: string;
  invitation_key?: string;
  my_did?: string;
  state?: MessageState;
  their_did?: string;
  their_role?: string;
}

export class ConnectionService {
  constructor() {}

  /*
    create an invitation to share with another agent.
  */

  async createInvitation(): Promise<IInvitationRequestResponse> {
    try {
      const res = await request
        .post(`${apiUrl}connections/create-invitation`)
        .set('Content-Type', 'application/json');
      if (res.status === 200) return res.body as IInvitationRequestResponse;
      throw new Error('Create invitation failed');
    } catch (err) {
      return err;
    }
  }

  /*
    Receive an invitation from an outside source.
  */

  async receiveInvitation(
    invitation: IInvitationRequest,
    accept: boolean = true,
    params?: IConnectionParams
  ): Promise<IInvitationRequestResponse> {
    console.log('invitation', invitation);
    const res = await request
      .post(`${apiUrl}connections/receive-invitation`)
      .query({ accept: accept.toString() })
      .send(invitation);
    return res.body;
  }

  /*
    Accept an invitation by Id. Called after receiving an
    invitation from another agent.

  */

  async acceptInvitation(id: string) {
    try {
      const res = await request.post(
        `${apiUrl}connections/${id}/accept-invitation`
      );

      return res.body;
    } catch (err) {
      console.log('accept invitation failed', err);
    }
  }

  /*
    Accept request responds to an invitation that has been sent to
    and accepted by another agent
  */

  async acceptRequest(id: string) {
    try {
      const res = await request(`${apiUrl}connections/${id}/accept-request`);
      if (res.status === 200) return res.body;
      throw new Error('accept request failed');
    } catch (err) {
      console.log('accept request error', err.message);
    }
  }

  /*
    lists all connections. Optional parameter to list
    a specific connection.
  */

  async connections(id: string | null = null, params: IConnectionParams = {}) {
    try {
      const res = id
        ? await request.get(`${apiUrl}connections/${id}`).query(params)
        : await request.get(`${apiUrl}connections`).query(params);
      return res.body.results;
    } catch (err) {
      console.log('connections call failed', err);
    }
  }

  /*
    Assign another connection as the inbound connection
  */
  async establishInbound(id: string, refId: string) {}

  /*

    TODO: Pull this out of the code. It simply formats an invitation for
    sending to an external agent.
  */

  /*
    send basic message to a connection (by connection id)
  */
  async sendMessage(id: string) {
    try {
      const res = await request.get(`${apiUrl}connections/${id}/send-message`);
      return res.body;
    } catch (err) {
      throw err.message;
    }
  }

  /*
    Remove existing connection record. Use this to "reject" a sent connection
  */
  async sendRemoveConnection(id: string): Promise<boolean> {
    try {
      const res = await request.get(`${apiUrl}${segment}${id}/remove`);
      if (res.status === 200) return true;
      return false;
    } catch (err) {
      return err;
    }
  }
}
