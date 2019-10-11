import test from 'ava';

import { Connection } from '../../agent/modules/connection/connection.model';
import AgentConfig from '../../../app/config';

let config = new AgentConfig();

let agentConnection = new Connection(config.agentUrl);
let testAgentConnection = new Connection(config.testAgentUrl);

const prefix = 'CONNECTION: ';

test(`${prefix} creates a new connection`, async t => {
  const invite = await agentConnection.createInvitation();
  t.is(typeof invite['@id'], 'string');
});
// create invitation

// accept invitation

//
