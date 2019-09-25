import { Agent } from '../agent/agent.model';

export class Client {
  agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }
}
