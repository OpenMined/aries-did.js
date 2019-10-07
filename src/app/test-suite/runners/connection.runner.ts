import { AgentController } from 'src/app/agent/agent.model';
import { Runner } from '../core/models/runner';
import { Connection } from 'src/app/agent/modules/connection/connection.model';

export class ConnectionRunner extends Runner<any> {
  connection: Connection;

  constructor(
    agent: AgentController,
    agentUnderTest: AgentController,
    module: string
  ) {
    super(agent, agentUnderTest, module);
    this.connection = agent.connection;
    this.runTests([
      { name: 'create-relationship', fn: this.createRelationship.bind(this) }
    ]).then(() => console.log('results', this.store));
  }

  async createRelationship(): Promise<boolean> {
    try {
      let invite = await this.connection.createInvitation();
      let res = await this.agentUnderTest.connection.invitationResponse(invite);
      return res.connection_id ? true : false;
    } catch {
      return false;
    }
  }
}
