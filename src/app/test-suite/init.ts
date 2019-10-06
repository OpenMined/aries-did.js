import AgentConfig from '../config';
import { AgentController } from '../agent/agent.model';
import { createModules } from './modules';
import { resolve } from 'path';

import { readdir, readFile } from 'fs';

const agentConfig = new AgentConfig();
const agentUrl = agentConfig.agentUrl;
const testUrl = agentConfig.testAgentUrl;

// const credential = new Credential(agentUrl)

const main = function() {
  const agentController = new AgentController(agentUrl);
  const testController = new AgentController(testUrl);
  let path = resolve(__dirname, './schema');
  readdir(path, (err, items) => {
    const schemas: JSON[] = [];
    for (let item of items) {
      let itmPath = `${path}\\${item}`;
      console.log('itmPath', itmPath);
      readFile(itmPath, (err, data) => {
        console.log('the file read', JSON.parse(data.toString()));
        schemas.push(JSON.parse(data.toString()));
        agentController.addSchema(JSON.parse(data.toString()));
        // console.log('schemas result', schemas);
        console.log('agent results', agentController.schemaList);
      });
    }
  });
  return { agentController, testController };
};

export default main;
