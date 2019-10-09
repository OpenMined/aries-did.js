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

const proof = new Proof(
  agentConfig.agentUrl,
  new Schema(agentConfig.agentUrl),
  new CredentialDefinition(agentConfig.agentUrl)
);

const schemaDef = {
  attributes: ['name', 'score', 'issued'],
  schema_name: 'A test schema',
  schema_version: '1.0'
};

const PREFIX = 'PROOF: ';

let connection_id: string;

before('PROOF: create a  relationship', async function() {
  const invite = await agentConnection.createInvitation();
  const accept = await agentConnection.invitationResponse(invite);
  connection_id = accept.connection_id;
  const response = await agentConnection.acceptInvitation(connection_id, true);
  // console.log(response);

  return;
});

describe('PROOF: controller tests', async function() {
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
  it(`${PREFIX}should fetch a single presentation exchange record by ID`, async function() {
    const res = await proof.records();
    expect(res).to.not.be.undefined;
    expect(res).to.have.own.property('connection_id');
  });
  it(`${PREFIX}should build a proof request`, async function() {
    const keys = ['proof request', 'connection_id', 'name'];
    const res = await proof.buildProofRequest(
      schemaDef,
      connection_id,
      'test proof'
    );
    expect(res).to.not.be.undefined;
    for (let key of keys) {
      expect(res).to.have.ownProperty(key);
    }
  });
  it(`${PREFIX}should verify a received presentation (by presex id)`, async function() {
    const res = await proof.verifyProofRequest();
    expect(res).to.not.be.undefined;
    expect(res).to.have.own.property('connection_id');
  });
  it(`${PREFIX}should send a free presentation request not bound to any proposal`, async function() {
    const res = await proof.sendPresentation();
    expect(res).to.equal('method not implemented');
  });
  it(`${PREFIX}should should remove an existing presentation exchange record (by presex ID)`, async function() {});

  it(`${PREFIX} should get all records`, async function() {});
});
