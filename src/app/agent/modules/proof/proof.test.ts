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

before('PROOF: create a  relationship', async function() {
  const getConnections = function(): boolean {
    let bool = false;
    agentConnection
      .getConnections({ state: 'active', initiator: 'external' })
      .then(connections => {
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

describe('PROOF: controller tests', async function() {});
