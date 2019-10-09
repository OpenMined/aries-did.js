import { expect } from 'chai';
import 'mocha';

import { Connection } from '../connection/connection.model';

import TestAgentConfig from '../../agent-test-config';
import {
  IInvitation,
  IReceiveInvitationRequestResponse,
  IAcceptApplicationRequestResponse
} from 'src/app/core/interfaces/invitation-request.interface';
import { IConnectionsResult } from 'src/app/core/interfaces/connection.interface';
import { Issue } from '../issue/issue.model';
import { Schema } from '../schema/schema.model';
import { CredentialDefinition } from '../credential-definition/credential-definition.model';
import { ICredDefSendResponse } from '../credential-definition/credential-definition.service';

const agentConfig = new TestAgentConfig();

// The required modules;
const agentConnection = new Connection(agentConfig.agentUrl);
const credDef = new CredentialDefinition(agentConfig.agentUrl);

const agentIssue = new Issue(agentConfig.agentUrl);
const testAgentIssue = new Issue(agentConfig.testAgentUrl);

const schema = new Schema(agentConfig.agentUrl);

let invite: IInvitation;
// let myInvite: IInvitation;
// let receive: IReceiveInvitationRequestResponse;
// let accept: IAcceptApplicationRequestResponse;

let credId: ICredDefSendResponse;
const prefix = 'ISSUE: ';

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

let activeConnection: IConnectionsResult;

before(
  `${prefix}create an invitation object for issue cred test`,
  async function() {
    await agentIssue.removeAllRecords();
    await testAgentIssue.removeAllRecords();
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
describe(`${prefix}credential model tests`, async function() {
  // TODO: this doesn't actually work correctly
  it(`${prefix}should issue a credential offer`, async function() {
    /* 
    let connection_id = activeConnection.connection_id;

    let res = await agentIssue.issueAndSendCred(
      connection_id,
      'test cred',
      attrs,
      credId.credential_definition_id
    );
    expect(res).not.to.be.undefined;
    */
  });
  it(`${prefix} should send a credential offer`, async function() {
    let connections = await agentConnection.getConnections({ state: 'active' });
    if (Array.isArray(connections)) {
      activeConnection = connections.filter(
        itm => itm.their_label !== 'AliceSmith'
      )[0];
    }
    let connId = activeConnection.connection_id;
    let res = await agentIssue.issueOfferSend(
      connId,
      'test credential',
      attrs,
      credId.credential_definition_id
    );
    // console.log('credential result', res);
    expect(res.schema_id).to.not.be.undefined;
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
});

after('all credential issue test', async function() {});
