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
const testConnection = new Connection(agentConfig.testAgentUrl);
const credDef = new CredentialDefinition(agentConfig.agentUrl);

const agentIssue = new Issue(agentConfig.agentUrl);

const schema = new Schema(agentConfig.agentUrl);
let activeConnection: IConnectionsResult;

const PREFIX = 'PROOF';

before('PROOF: create a  relationship', async function() {
  const getConnections = function(): boolean {
    let bool = false;
    agentConnection
      .getConnections({ state: 'active', initiator: 'external' })
      .then(connections => {
        if (Array.isArray(connections)) {
          if (connections.length > 0) {
            activeConnection = connections[0];
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

describe('PROOF: controller tests', async function() {
  it(`${PREFIX}should fetch a single presentation exchange record by ID`, async function() {});
  it(`${PREFIX}should fetch credentials for a presentation request from the wallet by ID`, async function() {});
  it(`${PREFIX}should fetch credentials for a presentation request from the wallet by ID and referent`, async function() {});
  it(`${PREFIX}should send a presentation proposal`, async function() {});
  it(`${PREFIX}should send a free presentation request not bound to any proposal`, async function() {});
  it(`${PREFIX}send a presentation request in reference to a proposal (by presex ID)`, async function() {});
  it(`${PREFIX}should verify a received presentation (by presex id)`, async function() {});
  it(`${PREFIX}should verify a received presentation (by presex Id)`, async function() {});
  it(`${PREFIX}should send a free presentation request not bound to any proposal`, async function() {});
  it(`${PREFIX}should should remove an existing presentation exchange record (by presex ID)`, async function() {});

  it(`${PREFIX} should get all records`, async function() {});
});
