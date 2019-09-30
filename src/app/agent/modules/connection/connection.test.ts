import { expect } from 'chai';
import 'mocha';

import { Connection } from './connection.model';

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
let myInvite: IInvitation;
let receive: IReceiveInvitationRequestResponse;
let accept: IAcceptApplicationRequestResponse;

before('create an invitation object', async () => {
  invite = await testConnection.createInvitation();
});

describe('connection model results', async () => {
  it('should create a new invitation', async () => {
    const invite = await agentConnection.createInvitation();
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
    expect(accept).to.haveOwnProperty('their_label');
    expect(accept).to.haveOwnProperty('connection_id');
    expect(accept.their_label).to.equal('Faber');
  });
  it('should respond to an invitation', async () => {
    const invite = await agentConnection.createInvitation();
    const receive = await testConnection.invitationResponse(invite);
    await testConnection.acceptInvitation(receive.connection_id);
    const connection = await agentConnection.getConnections({
      state: 'request',
      initiator: 'self'
    });
    if (Array.isArray(connection)) {
      const connToGet = connection[0];
      console.log('the connection to get', connToGet);
      const responseResponse = await agentConnection.requestResponse(
        connToGet.connection_id
      );
      expect(responseResponse).to.haveOwnProperty('routing_state');
      expect(responseResponse).to.haveOwnProperty('initiator');
      expect(responseResponse.initiator).to.equal('self');
    }
  });
  it('should get a single connection', async () => {
    const connections = await agentConnection.getConnections();
    if (Array.isArray(connections)) {
      const connToGet = connections[0];
      const connection = await agentConnection.getConnections(
        {},
        connToGet.connection_id
      );
      // console.log('the connection', connection);
      if (!Array.isArray(connection)) {
        expect(connection.state).to.not.be.undefined;
      }
    }
  });
  it('should remove a single connection', async () => {
    const connections = await agentConnection.getConnections();
    if (Array.isArray(connections)) {
      const id = connections[0].connection_id;
      await agentConnection.removeConnection(id);
      console.log('the id', id);
      const connection = await agentConnection.getConnections({}, id);
      if (!Array.isArray(connection)) {
        console.log('the removed connection', connection);
        expect(connection.accept).to.be.undefined;
      }
    }
  });
  it('should remove all connections', async () => {
    // await agentConnection.removeAllConnections();
    // const res = await agentConnection.getConnections();
    // expect(res).to.be.empty;
  });
});
