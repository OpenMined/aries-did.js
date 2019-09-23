import { AgentService } from './agent.service';

const main = async () => {
  const agentService = new AgentService();

  const invitation = await agentService.createInvitation();

  const invite = await agentService.formatInvitation(invitation);

  const connectInvitation = await agentService.receiveInvitation({
    '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
    '@id': '95e84159-096c-4e69-a142-800f3c649e6f',
    serviceEndpoint: 'http://192.168.65.3:8020',
    label: 'Faber Agent',
    recipientKeys: ['rbTayuSW6kdoauLsrjyuG8cypAMYmqVq371hvK2yF2s']
  });
  // console.log('connection invitation', connectInvitation);

  const acceptInvitation = await agentService.acceptInvitation(
    connectInvitation.connection_id
  );
  // console.log('accept invitation', acceptInvitation);

  const connections = await agentService.connections();
  // console.log('connections', connections.results[0].activity);
  const id = connections.results[0].activity[0].connection_id;
  const connection = await agentService.connections(id);
  console.log('connection', connection);
};

main();
