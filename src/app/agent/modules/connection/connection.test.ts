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
let testAgentInvite: IInvitation;

let receive: IReceiveInvitationRequestResponse;
let accept: IAcceptApplicationRequestResponse;

const prefix = 'CONNECTION: ';

describe('connection model results', async () => {
  before(prefix + 'create an invitation object', async () => {
    invite = await agentConnection.createInvitation();
    testAgentInvite = await testConnection.createInvitation();
    const receive = await agentConnection.invitationResponse(testAgentInvite);
    const accept = await agentConnection.acceptInvitation(
      receive.connection_id
    );
    const testConnections = await testConnection.getConnections();
    console.log('the test connection', testConnections);
    // await testConnection.acceptInvitation(receive.connection_id);
  });
  it('should create a new invitation', async function() {
    const agentInvite = await agentConnection.createInvitation();
    expect(agentInvite).to.haveOwnProperty('@type');
    expect(agentInvite).to.haveOwnProperty('@id');
    expect(agentInvite).to.haveOwnProperty('recipientKeys');
    expect(agentInvite).to.haveOwnProperty('label');
    expect(agentInvite).to.haveOwnProperty('serviceEndpoint');
  });
  it('should receive an invitation', async function() {
    receive = await agentConnection.invitationResponse(testAgentInvite);
    expect(receive).to.haveOwnProperty('connection_id');
    expect(receive).to.haveOwnProperty('created_at');
    expect(receive).to.haveOwnProperty('state');
    expect(receive.initiator).to.equal('external');
  });
  it('should accept an invitation', async function() {
    // console.log('recevied connection', receive.connection_id);
    accept = await agentConnection.acceptInvitation(receive.connection_id);
    expect(accept).to.haveOwnProperty('their_label');
    expect(accept).to.haveOwnProperty('connection_id');
    expect(accept.their_label).to.equal('Faber');
    const testConnections = await testConnection.getConnections();
    // console.log(testConnections);
  });
  /*
  
  it('should responsd to an invitation', async function() {
    // const responseResponse = await agentConnection.requestResponse(
    //   accept.connection_id
    //   // receive.connection_id
    // );
    // expect(responseResponse).to.exist;
  });
  /*

  it('CONNECTION: should respond to an invitation', async function() {
    let connection = await testConnection.getConnections();
    console.log('connections', connection);

    if (Array.isArray(connection)) {
      const responseResponse = await testConnection.requestResponse(
        connection[0].connection_id
        // receive.connection_id
      );
      expect(responseResponse).to.haveOwnProperty('initiator');
      expect(responseResponse.initiator).to.equal('self');
      console.log('the response', responseResponse);
    }
  });
  */
  it('should have active connections', async function() {
    const agentRes = await agentConnection.getConnections();
    const testAgentRes = await testConnection.getConnections();
    // console.log('test agent connections', testAgentRes);
    expect(agentRes).to.not.be.empty;
    expect(testAgentRes).to.not.be.empty;
    // console.log(res);
  });

  // TODO: fix this test - there's a time delay but I've set up auto accept on all the
  // actual calls so this is kind of moot at present.

  /*
  it('should get a single connection', async () => {
    const connections = await agentConnection.getConnections();
    if (Array.isArray(connections)) {
      const connToGet = connections[0];
      const connection = await agentConnection.getConnections(
        {},
        connToGet.connection_id
      );
      if (!Array.isArray(connection)) {
        expect(connection.state).to.not.be.undefined;
      }
    }
  });
  it('should make a connection active', async () => {
    const connections = await testConnection.getConnections({
      state: 'request'
    });
    expect(connections).to.not.be.empty;
    if (Array.isArray(connections)) {
      let id = connections[0].connection_id;
      // let accept = await testConnection.acceptInvitation(id);
      let response = await testConnection.requestResponse(id);
      let active = await agentConnection.getConnections({ state: 'active' });
      expect(response.connection_id).to.not.be.undefined;
      if (Array.isArray(active)) {
        expect(active[0].state).to.equal('active');
      }
    }
  });
  it('agent should have an active connection', async () => {
    let activeConnections = await agentConnection.getConnections({
      state: 'request'
    });
    expect(activeConnections).to.exist;

    if (Array.isArray(activeConnections)) {
      let id = activeConnections[0].connection_id;
      await agentConnection.requestResponse(id);
    }
  });
  it('should remove a single connection', async () => {
    // TODO: this works but there's a delay.. not sure how to fix at this time
    // const connections = await agentConnection.getConnections();
    // if (Array.isArray(connections)) {
    //   console.log('connections length', connections.length);
    //   const id = connections[0].connection_id;
    //   console.log('the id ', id);
    //   await agentConnection.removeConnection(id);
    //   const connection = await agentConnection.getConnections({}, id);
    //   if (!Array.isArray(connection)) {
    //     expect(connection.accept).to.be.undefined;
    //   }
    // }
  });
  */
  it('should remove all connections', async () => {
    await testConnection.removeAllConnections();
    await agentConnection.removeAllConnections();
    // expect(res).to.be.empty;
  });
});
