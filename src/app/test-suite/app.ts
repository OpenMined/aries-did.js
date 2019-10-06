import AgentConfig from '../config';
import { AgentController } from '../agent/agent.model';
import { createModules } from './modules';

const agentConfig = new AgentConfig();
const agentUrl = agentConfig.agentUrl;
const testUrl = agentConfig.testUrl;

// const credential = new Credential(agentUrl)

const agentController = new AgentController(createModules(agentUrl));
const testController = new AgentController(createModules(testUrl));

export default { agent: agentController, test: testController };
