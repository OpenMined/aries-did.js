import { AgentController } from "../../../agent/agent.model";
import { Results, IResult } from "./results";

export interface IRunner {
  agent: AgentController;
  agentUnderTest: AgentController;
}
export interface ITest {
  name: string;
  fn: () => Promise<boolean>;
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

  async runTests(tests: Array<ITest>) {
    for (let test of tests) {
      await this.runTest(test.name, test.fn);
    }
  }

  addResult(res: IResult) {
    this.store.addResults({ ...res });
  }

  async runTest(name: string, test: () => Promise<boolean>) {
    const pass = await test();
    this.addResult({ name, pass });
  }
}
