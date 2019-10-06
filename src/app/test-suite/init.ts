import AgentConfig from '../config';
import { AgentController } from '../agent/agent.model';
import { createModules } from './modules';
import { resolve } from 'path';

const fs = require('fs');

const agentConfig = new AgentConfig();
const agentUrl = agentConfig.agentUrl;
const testUrl = agentConfig.testAgentUrl;

// const credential = new Credential(agentUrl)

const main = function() {
  const agentController = new AgentController(createModules(agentUrl));
  const testController = new AgentController(createModules(testUrl));
  let path = resolve(__dirname, './schema');
  console.log('the path', path);
  return { agentController, testController };
};

export default main;
