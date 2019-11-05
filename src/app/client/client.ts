import { AgentController } from '../agent/agent.model';
import * as cluster from 'cluster';

import AgentConfig from '../config';

import db from './db';

// db.allDocs().then(itm => {});

let client: AgentController;

if (cluster.isWorker) {
  let id = cluster.worker.id - 1;
  let agentConfig = new AgentConfig();
  let mapping = [
    agentConfig.agentUrl,
    agentConfig.testAgentUrl,
    agentConfig.acmeAgentUrl
  ];
  console.log('the client mappidingId', mapping[id]);

  client = new AgentController(mapping[id]);
} else {
  let agentConfig = new AgentConfig();
  client = new AgentController(agentConfig.agentUrl);
}

export default client;
