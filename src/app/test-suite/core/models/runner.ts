import { AgentController } from 'src/app/agent/agent.model';
import { Results } from './results';

export interface IRunner {
  agent: AgentController;
  agentUnderTest: AgentController;
}

export class Runner<T> implements IRunner {
  agent: AgentController;
  agentUnderTest: AgentController;
  store: Results;

  constructor(
    agent: AgentController,
    agentUnderTest: AgentController,
    module: string
  ) {
    this.agent = agent;
    this.agentUnderTest = agentUnderTest;
    this.store = new Results(module);
  }
}
