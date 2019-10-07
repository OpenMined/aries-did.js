import { AgentController } from '../agent/agent.model';

export class Client {
  agent: AgentController;

  constructor(agent: AgentController) {
    this.agent = agent;
  }
}
