import AgentConfig from '../config';
import { AgentController } from '../agent/agent.model';
import { createModules } from './modules';
import { resolve } from 'path';

import { readSchema } from './scripts/schema.script';
import { ConnectionRunner } from './runners/connection.runner';

const agentConfig = new AgentConfig();
const agentUrl = agentConfig.agentUrl;
const testUrl = agentConfig.testAgentUrl;

// const credential = new Credential(agentUrl)

const main = function() {
  let agentController = new AgentController(agentUrl);
  let testController = new AgentController(testUrl);
  let path = resolve(__dirname, './schema');
  agentController = readSchema(path, agentController);
  const connectionRunner = new ConnectionRunner(
    agentController,
    testController,
    'connection'
  );

  return { agentController, testController };
};

export default main;
