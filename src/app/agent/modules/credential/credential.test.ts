import { expect } from 'chai';
import 'mocha';

import { Credential } from './credential.model';
import AgentConfig from '../../../config';
import { Connection } from '../connection/connection.model';
import { Issue } from '../issue/issue.model';
import { Schema } from '../schema/schema.model';
import { CredentialDefinition } from '../credential-definition/credential-definition.model';

const config = new AgentConfig();

const agentConnection = new Connection(config.agentUrl);
const testAgentConnection = new Connection(config.testAgentUrl);

const testAgentSchema = new Schema(config.testAgentUrl);
const testAgentCredDef = new CredentialDefinition(config.testAgentUrl);

const testAgentIssue = new Issue(config.testAgentUrl);
const agentIssue = new Issue(config.agentUrl);
const agentCredential = new Credential(config.agentUrl);

const prefix = 'CREDENTIAL: ';

let attrs = [
  {
    name: 'kind',
    value: 'BachelorOfCommerce'
  },
  {
    name: 'score',
    value: '4.0'
  },
  {
    name: 'issued',
    value: '01/01/2006'
  }
];

const schemaDef = {
  attributes: ['kind', 'score', 'issued'],
  schema_name: 'TestSchemaTwors',
  schema_version: '1.0'
};

describe(`${prefix}model tests`, async function() {
  before(`${prefix}issue a valid credential to the agent`, async function() {
    const testAgentInvite = await testAgentConnection.createInvitation();
    await agentConnection.invitationResponse(testAgentInvite);

    let connections = await testAgentConnection.getConnections();
    while (Array.isArray(connections) && connections.length < 1) {
      connections = await testAgentConnection.getConnections();
    }
    const schema = await testAgentSchema.createSchema(schemaDef);
    let credDefId = await testAgentCredDef.createCredentialDefinition(
      schema.schema_id
    );
    if (Array.isArray(connections)) {
      let credExId: string;
      await testAgentIssue.issueOfferSend(
        connections[0].connection_id,
        'test credential',
        attrs,
        credDefId
      );
      let records = await agentIssue.records();
      let filtered = agentIssue.filterIssueCrendentials(
        'state',
        'offer_received',
        records
      );

      while (filtered.length < 1) {
        records = await agentIssue.records();
        filtered = agentIssue.filterIssueCrendentials(
          'state',
          'offer_received',
          records
        );
        if (filtered.length > 1) {
          credExId = filtered[0].credential_exchange_id;
          let response = await agentIssue.sendRequestById(credExId);
          let testAgentRecords = await testAgentIssue.records();
        }
      }
    }
  });
  it(`${prefix}should fetch a list of issued credentials`, async function() {
    const credentials = await agentCredential.records();
    expect(credentials).to.not.be.empty;
  });
});
