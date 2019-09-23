import { IConnection, IBasicMessage } from '../core/interfaces/agent.interface';

import * as request from 'superagent';
import { IInvitationRequestResponse } from '../core/interfaces/invitation-request.interface';

// {"@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation", "@id": "ec614be6-512c-49b8
// -aa34-7e3b9db7a8d8", "label": "Faber Agent", "serviceEndpoint": "http://192.168.65.3:8020", "recipient
// Keys": ["GeJB1huDiAAwsPdZdrHFo7ktmTZ5bPNo5AKqKfERRCxw"]}

export class AgentService {
  connectionId: string;

  constructor() {
    // get('http://localhost:8051/protocols')
    //   .send()
    //   .end((err, res) => console.log(res));
  }

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

    // const connection = await get('http://192.168.65.3:8020');
  }

  handleIssueCredentials() {}

  handlePresentProof() {}

  handleBasicMessages(mssg: IBasicMessage) {
    console.log('Received message ', mssg.content);
  }

  async createInvitation() {
    const res = await request
      .post('http://localhost:8051/connections/create-invitation')
      .set('Content-Type', 'application/json');
    // console.log('result', res.body);
    return res.body as IInvitationRequestResponse;
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
  /*

"@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation", 
    "@id": "95e84159-096c-4e69-a142-800f3c649e6f", 
    "serviceEndpoint": "http://192.168.65.3:8020", 
    "label": "Faber Agent", 
    "recipientKeys": ["rbTayuSW6kdoauLsrjyuG8cypAMYmqVq371hvK2yF2s"]}
  */
}
