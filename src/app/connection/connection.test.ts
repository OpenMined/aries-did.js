import { ConnectionService } from './connection.service';

const main = async () => {
  const connectionService = new ConnectionService();

  const invitation = await connectionService.createInvitation();

  const invite = await connectionService.formatInvitation(invitation);

  const connectInvitation = await connectionService.receiveInvitation({
    '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
    '@id': '95e84159-096c-4e69-a142-800f3c649e6f',
    serviceEndpoint: 'http://192.168.65.3:8020',
    label: 'Faber Agent',
    recipientKeys: ['rbTayuSW6kdoauLsrjyuG8cypAMYmqVq371hvK2yF2s']
  });
  // console.log('connection invitation', connectInvitation);

  const acceptInvitation = await connectionService.acceptInvitation(
    connectInvitation.connection_id
  );
  // console.log('accept invitation', acceptInvitation);

  const connections = await connectionService.connections();
  // console.log('connections', connections.results[0].activity);
  const id = connections.results[0].activity[0].connection_id;
  const connection = await connectionService.connections(id);
  console.log('connection', connection);
};

main();
