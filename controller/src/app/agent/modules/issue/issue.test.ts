import { expect } from 'chai';
import 'mocha';

import { Connection } from '../connection/connection.model';

import TestAgentConfig from '../../agent-test-config';

import { Issue } from '../issue/issue.model';
import { Schema } from '../schema/schema.model';
import { CredentialDefinition } from '../credential-definition/credential-definition.model';
import { ICredDefSendResponse } from '../credential-definition/credential-definition.service';

const agentConfig = new TestAgentConfig();

// The required modules;
const agentConnection = new Connection(agentConfig.agentUrl);
const testAgentConnection = new Connection(agentConfig.testAgentUrl);
const credDef = new CredentialDefinition(agentConfig.agentUrl);

const agentIssue = new Issue(agentConfig.agentUrl);
const testAgentIssue = new Issue(agentConfig.testAgentUrl);

const schema = new Schema(agentConfig.agentUrl);

let credId: ICredDefSendResponse;
const prefix = 'ISSUE: ';

let connectionId: string;

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

describe(`${prefix}issue credential model tests`, async function() {
  // this.timeout(5000);
  before(
    `${prefix}create a relationship for issue cred test`,
    async function() {
      let testAgentInvite = await testAgentConnection.createInvitation();
      const receive = await agentConnection.invitationResponse(testAgentInvite);

      connectionId = receive.connection_id;
      let testConnections = await testAgentConnection.getConnections({
        state: 'request'
      });

      while (Array.isArray(testConnections) && testConnections.length < 1) {
        testConnections = await testAgentConnection.getConnections({
          state: 'request'
        });

        if (Array.isArray(testConnections) && testConnections.length > 0) {
          await testAgentConnection.sendTrustPing(
            testConnections[0].connection_id
          );
          await agentConnection.sendTrustPing(receive.connection_id);
          const agentConnections = await agentConnection.getConnections();
        }
      }
    }
  );

  beforeEach(
    `${prefix}create a new cred def for creating a issue test`,
    async function() {
      const res = await schema.createSchema(schemaDef);
      expect(res).to.not.be.undefined;
      expect(res).to.haveOwnProperty('schema_id');
      let schemaId = res.schema_id;
      credId = await credDef.createCredentialDefinition(schemaId);
    }
  );

  it(`${prefix} should send a credential offer`, async function() {
    const connections = await agentConnection.getConnections({});
    if (Array.isArray(connections)) {
      let res = await agentIssue.issueOfferSend(
        connections[0].connection_id,
        'test credential',
        attrs,
        credId.credential_definition_id
      );
      expect(res.schema_id).to.not.be.undefined;
    }
  });
  it(`${prefix} should get active records`, async function() {
    let res = await agentIssue.records();
    expect(res).to.not.be.undefined;
    expect(res).to.be.an.instanceOf(Array);
  });
  it(`${prefix} should get all testagent active records`, async function() {
    let res = await testAgentIssue.records();
    expect(res).to.not.be.undefined;
    expect(res).to.be.an.instanceOf(Array);
    expect(res.length).to.be.greaterThan(0);
  });
  it(`${prefix} should get received offers`, async function() {
    let res = await testAgentIssue.records();
    let filtered = agentIssue.filterIssueCrendentials(
      'state',
      'offer_received',
      res
    );
    expect(filtered).to.not.be.undefined;
    expect(filtered.length).to.be.greaterThan(0);
  });

  it(`${prefix} should get sent offers`, async function() {
    let res = await agentIssue.records();
    let filtered = agentIssue.filterIssueCrendentials(
      'state',
      'offer_sent',
      res
    );
    expect(filtered).to.not.be.undefined;
    expect(filtered.length).to.be.greaterThan(0);
  });

  it(`${prefix} should respond to a a sent offer`, async function() {
    const keys = ['thread_id', 'credential_request', 'credential_exchange_id'];
    let records = await testAgentIssue.records();
    let filtered = agentIssue.filterIssueCrendentials(
      'state',
      'offer_received',
      records
    );
    expect(filtered).to.not.be.undefined;
    expect(filtered.length).to.be.greaterThan(0);
    expect(records).to.not.be.undefined;
    expect(records.length).to.be.greaterThan(0);
    let record = filtered[0].credential_exchange_id;
    let response = await testAgentIssue.sendRequestById(record);
    expect(response).to.not.be.undefined;
    for (let key of keys) {
      expect(response).to.have.ownProperty(key);
    }
  });
  it(`${prefix} should issue a credential`, async function() {
    let records = await agentIssue.records();

    let filtered = agentIssue.filterIssueCrendentials(
      'state',
      'request_received',
      records
    );
    while (filtered.length < 1) {
      records = await agentIssue.records();
      filtered = agentIssue.filterIssueCrendentials(
        'state',
        'request_received',
        records
      );
    }
    let issue = await agentIssue.sendIssueById(
      filtered[0].credential_exchange_id,
      attrs,
      'issuing the cred'
    );
    expect(issue).to.not.be.undefined;
  });
  it(`${prefix}should store a received credential`, async function() {
    let records = await testAgentIssue.records();
    let filtered = agentIssue.filterIssueCrendentials(
      'state',
      'credential_received',
      records
    );
    let stored = await testAgentIssue.sendStoreById(
      filtered[0].credential_exchange_id
    );
    expect(stored).to.not.be.undefined;
  });
  after('all credential issue test', async function() {
    await agentConnection.removeAllConnections();
    await testAgentConnection.removeAllConnections();
    await agentIssue.removeAllRecords();
    await testAgentIssue.removeAllRecords();
    return;
  });
});
