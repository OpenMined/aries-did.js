import {
  IInvitationRequest,
  IInvitationRequestResponse
} from '../core/interfaces/invitation-request.interface';
import * as request from 'superagent';

const apiUrl = 'http://localhost:8051/';

export class ConnectionService {
  constructor() {}

  /*
    create an invitation to share with another agent.
  */

  async createInvitation() {
    const res = await request
      .post(`${apiUrl}connections/create-invitation`)
      .set('Content-Type', 'application/json');
    return res.body as IInvitationRequestResponse;
  }

  /*
    Receive an invitation from an outside source.
  */

  async receiveInvitation(invitation: IInvitationRequest) {
    const res = await request
      .post(`${apiUrl}connections/receive-invitation`)
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
    lists all connections. Optional parameter to list
    a specific connection.
  */

  async connections(id?: string) {
    try {
      const res = id
        ? await request(`${apiUrl}connections/${id}`)
        : await request(`${apiUrl}connections`);
      return res.body.results;
    } catch (err) {
      console.log('connections call failed', err);
    }
  }

  /*
    Accept request responds to an invitation that has been sent to
    and accepted by another agent
  */

  async acceptRequest(id: string) {
    try {
      const res = await request(`${apiUrl}connections/${id}/accept-request`);
      return res.body;
    } catch (err) {
      console.log('accept request error', err.message);
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

  async formatInvitation(body: IInvitationRequestResponse) {
    const invitation = {
      '@type': body.invitation['@type'],
      '@id': body.invitation['@id'],
      serviceEndpoint: body.invitation.serviceEndpoint,
      label: 'Node Controller',
      recipientKeys: body.invitation.recipientKeys
    };
    return JSON.stringify(invitation);
  }

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
}
