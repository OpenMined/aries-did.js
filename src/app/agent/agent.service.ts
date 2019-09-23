import { IConnection, IBasicMessage } from '../core/interfaces/agent.interface';

import * as request from 'superagent';
import {
  IInvitationRequestResponse,
  IInvitationRequest
} from '../core/interfaces/invitation-request.interface';

// {"@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation", "@id": "ec614be6-512c-49b8
// -aa34-7e3b9db7a8d8", "label": "Faber Agent", "serviceEndpoint": "http://192.168.65.3:8020", "recipient
// Keys": ["GeJB1huDiAAwsPdZdrHFo7ktmTZ5bPNo5AKqKfERRCxw"]}

const apiUrl = 'http://localhost:8051/';

export class AgentService {
  connectionId: string;

  constructor() {}

  detectConnection() {}

  async connectionReady() {}

  async handleConnections(message: IConnection) {
    console.log('message');
    if (
      message.connectionId === this.connectionId &&
      message.state === 'active'
    ) {
      return console.log('Connected');
    }
  }

  handleIssueCredentials() {}

  handlePresentProof() {}

  handleBasicMessages(mssg: IBasicMessage) {
    console.log('Received message ', mssg.content);
  }

  async receiveInvitation(invitation: IInvitationRequest) {
    const res = await request
      .post('http://localhost:8051/connections/receive-invitation')
      .send(invitation);
    return res.body;
  }

  async createInvitation() {
    const res = await request
      .post('http://localhost:8051/connections/create-invitation')
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
        ? await request.get(`${apiUrl}connections/${id}`)
        : await request(`${apiUrl}connections`);
      return res.body;
    } catch (err) {
      console.log('connections call failed', err);
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
