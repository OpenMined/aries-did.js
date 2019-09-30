import { ConnectionService } from './connection.service';
import { Connection } from './connection.model';

import { expect } from 'chai';
import 'mocha';

import TestAgentConfig from '../../agent-test-config';
import {
  IInvitation,
  IReceiveInvitationRequestResponse,
  IAcceptApplicationRequestResponse
} from 'src/app/core/interfaces/invitation-request.interface';

const agentConfig = new TestAgentConfig();

const agentConnection = new Connection(agentConfig.agentUrl);
const testConnection = new Connection(agentConfig.testAgentUrl);

let invite: IInvitation;
let receive: IReceiveInvitationRequestResponse;
let accept: IAcceptApplicationRequestResponse;

before('create an invitation object', async () => {
  invite = await testConnection.createInvitation();
});

describe('create new invitation', async () => {
  it('should create a new invitation', async () => {
    const invite = await agentConnection.createInvitation();
    console.log('invitation', invite);
    expect(invite).to.haveOwnProperty('@type');
    expect(invite).to.haveOwnProperty('@id');
    expect(invite).to.haveOwnProperty('recipientKeys');
    expect(invite).to.haveOwnProperty('label');
    expect(invite).to.haveOwnProperty('serviceEndpoint');
  });
  it('should receive an invitation', async () => {
    receive = await agentConnection.invitationResponse(invite);
    expect(receive).to.haveOwnProperty('connection_id');
    expect(receive).to.haveOwnProperty('created_at');
    expect(receive).to.haveOwnProperty('state');
    expect(receive.initiator).to.equal('external');
  });
  it('should accept an invitation', async () => {
    accept = await agentConnection.acceptInvitation(receive.connection_id);
    console.log('accept result', accept);
    expect(accept).to.haveOwnProperty('their_label');
    expect(accept).to.haveOwnProperty('connection_id');
    expect(accept.their_label).to.equal('Faber');
  });
});
