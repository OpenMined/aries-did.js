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

const agentConfig = new TestAgentConfig();

// The required modules;
const agentConnection = new Connection(agentConfig.agentUrl);
const testConnection = new Connection(agentConfig.testAgentUrl);
const credDef = new CredentialDefinition(agentConfig.agentUrl);

const agentIssue = new Issue(agentConfig.agentUrl);

const schema = new Schema(agentConfig.agentUrl);

let invite: IInvitation;
// let myInvite: IInvitation;
// let receive: IReceiveInvitationRequestResponse;
// let accept: IAcceptApplicationRequestResponse;

let credId: string;

const schemaDef = {
  attributes: ['kind', 'score', 'issued'],
  schema_name: 'DegreeSchema',
  schema_version: '1.0'
};

let activeConnection: IConnectionsResult;

before('create an invitation object for issue cred test', async function() {
  // await testConnection.removeAllConnections();
  // invite = await testConnection.createInvitation();
  const agentInvite = await agentConnection.createInvitation();
  const receive = await testConnection.invitationResponse(agentInvite);
  await agentConnection.acceptInvitation(receive.connection_id);
  const getConnections = function(): boolean {
    let bool = false;
    agentConnection.getConnections({ state: 'active' }).then(connections => {
      if (Array.isArray(connections)) {
        if (connections.length > 0) {
          activeConnection = connections[0];
          // console.log('each connection', activeConnection);
          bool = true;
        } else {
          bool = false;
        }
      } else {
        bool = false;
      }
    });
    return bool;
  };
  let x = 0;
  while (x <= 7) {
    if (x === 7) return 'no connections';
    let connections = getConnections();

    connections ? (x = 7) : (x += 1);

    break;
  }
  return;
});

/*

{
  "credential_definition_id": "WgWxqztrNooG92RXvxSTWv:3:CL:20:tag",
  "credential_proposal": {
    "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
    "attributes": [
      {
        "name": "favourite_drink",
        "mime-type": "image/jpeg",
        "value": "martini"
      }
    ]
  },
  "connection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "comment": "string"
}
*/

beforeEach('create a new cred def for creating a issue test', async function() {
  const res = await schema.createSchema(schemaDef);
  // console.log('schema result', res);
  expect(res).to.not.be.undefined;
  expect(res).to.haveOwnProperty('schema_id');
  let schemaId = res.schema_id;
  credId = await credDef.createCredentialDefinition(schemaId);
});

describe('issue credential from agent API', async function() {
  it('should issue a credential offer', async function() {
    // console.log('the active connection ', activeConnection);
    let connection_id = activeConnection.connection_id;
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
    let res = await agentIssue.issueAndSendCred(
      connection_id,
      'test cred',
      attrs,
      credId
    );
    console.log('credential result', res);
    expect(res).not.to.be.undefined;
  });
});
