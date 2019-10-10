import { expect } from 'chai';
import 'mocha';

import { Connection } from '../connection/connection.model';

import TestAgentConfig from '../../agent-test-config';
import {
  IInvitation,
  IReceiveInvitationRequestResponse,
  IAcceptApplicationRequestResponse
} from 'src/app/core/interfaces/invitation-request.interface';
import { Schema } from '../schema/schema.model';
import { CredentialDefinition } from '../credential-definition/credential-definition.model';
import { Proof } from './proof.model';

const agentConfig = new TestAgentConfig();

// The required modules;
const agentConnection = new Connection(agentConfig.agentUrl);
const testAgentConnection = new Connection(agentConfig.testAgentUrl);

const proof = new Proof(
  agentConfig.agentUrl,
  new Schema(agentConfig.agentUrl),
  new CredentialDefinition(agentConfig.agentUrl)
);

const schemaDef = {
  attributes: ['name', 'score', 'issued'],
  schema_name: 'ATestSchema',
  schema_version: '1.0'
};

const PREFIX = 'PROOF: ';

let connectionId: string;

describe('PROOF: controller tests', async function() {
  before('PROOF: create a  relationship', async function() {
    let testAgentInvite = await testAgentConnection.createInvitation();
    const receive = await agentConnection.invitationResponse(testAgentInvite);
    // const accept = await agentConnection.acceptInvitation(
    //   receive.connection_id
    // );
    connectionId = receive.connection_id;
    return;
  });
  // it(`${PREFIX}should fetch credentials for a presentation request from the wallet by ID`, async function() {});
  // it(`${PREFIX}should fetch credentials for a presentation request from the wallet by ID and referent`, async function() {});
  it(`${PREFIX}should send a presentation proposal`, async function() {
    const res = await proof.sendProposal();
    expect(res).to.equal('method not implemented');
  });
  it(`${PREFIX}should send a free presentation request not bound to any proposal`, async function() {
    const res = await proof.sendPresentation();
    expect(res).to.equal('method not implemented');
  });
  it(`${PREFIX}send a presentation request in reference to a proposal (by presex ID)`, async function() {
    const res = await proof.sendPresentation();
    expect(res).to.equal('method not implemented');
  });

  it(`${PREFIX}should build a proof request object`, async function() {
    const keys = ['proof_request', 'connection_id', 'version'];
    const res = await proof.buildProofRequest(
      schemaDef,
      connectionId,
      'test proof'
    );
    expect(res).to.not.be.undefined;
    for (let key of keys) {
      expect(res).to.have.property(key);
    }
    expect(res.proof_request.name).to.equal('test proof');
  });
  it(`${PREFIX}should send a free presentation request not bound to any proposal`, async function() {
    // const connections = await agentConnection.getConnections({
    // state: 'active'
    // });
    // if (Array.isArray(connections)) {
    const proofRequest = await proof.buildProofRequest(
      schemaDef,
      connectionId,
      'test proof'
    );
    // console.log('the proof request', JSON.stringify(proofRequest));
    const res = await proof.sendProofRequest(proofRequest);
    expect(res).to.haveOwnProperty('presentation_exchange_id');
  });
  it(`${PREFIX}should verify a received presentation (by presex id)`, async function() {
    const res = await proof.verifyProofRequest();
    expect(res).to.not.be.undefined;
  });

  it(`${PREFIX}should should remove an existing presentation exchange record (by presex ID)`, async function() {});

  it(`${PREFIX} should get all records`, async function() {});
  it(`${PREFIX}should fetch a single presentation exchange record by ID`, async function() {
    const res = await proof.records();
    expect(res).to.not.be.undefined;
    expect(res).to.have.own.property('connection_id');
  });
  after('clear connections', async function() {
    await agentConnection.removeAllConnections();
    await testAgentConnection.removeAllConnections();
    return;
  });
});
