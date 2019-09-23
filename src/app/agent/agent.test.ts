import { AgentService } from './agent.service';

const main = async () => {
  const agentService = new AgentService();

  const invitation = await agentService.createInvitation();

  const invite = await agentService.formatInvitation(invitation);
  console.log('invite', invite);
};

main();
