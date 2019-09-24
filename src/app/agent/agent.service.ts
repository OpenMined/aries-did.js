import { IConnection, IBasicMessage } from '../core/interfaces/agent.interface';

import * as request from 'superagent';
import {
  IInvitationRequestResponse,
  IInvitationRequest
} from '../core/interfaces/invitation-request.interface';

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

  
}
