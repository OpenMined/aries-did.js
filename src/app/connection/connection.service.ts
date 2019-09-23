import {
  IInvitationRequest,
  IInvitationRequestResponse
} from '../core/interfaces/invitation-request.interface';
import * as request from 'superagent';

const apiUrl = 'http://localhost:8051/';

export class ConnectionService {
  constructor() {}
  async receiveInvitation(invitation: IInvitationRequest) {
    const res = await request
      .post(`${apiUrl}connections/receive-invitation`)
      .send(invitation);
    return res.body;
  }

  async createInvitation() {
    const res = await request
      .post(`${apiUrl}connections/create-invitation`)
      .set('Content-Type', 'application/json');
    return res.body as IInvitationRequestResponse;
  }

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

  async connections(id?: string) {
    try {
      const res = id
        ? await request(`${apiUrl}connections/${id}`)
        : await request(`${apiUrl}connections`);
      return res.body;
    } catch (err) {
      console.log('connections call failed', err);
    }
  }

  async acceptRequest(id: string) {
    try {
      const res = await request(`${apiUrl}connections/${id}/accept-request`);
      return res.body;
    } catch (err) {
      console.log('accept request error', err.message);
    }
  }

  async formatInvitation(body: IInvitationRequestResponse) {
    const invitation = {
      '@type': body.invitation['@type'],
      '@id': body.invitation['@id'],
      serviceEndpoint: 'http://localhost:8051',
      label: 'Node Controller',
      recipientKeys: body.invitation.recipientKeys
    };
    return JSON.stringify(invitation);
  }
}
