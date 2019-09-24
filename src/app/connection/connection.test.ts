import { ConnectionService } from './connection.service';
import { Connection } from './connection.model';

const main = async () => {
  const connectionService = new ConnectionService();

  const invitation = await connectionService.createInvitation();
  // console.log('invitation', invitation);
  const invite = await connectionService.formatInvitation(invitation);

  console.log('invite', invite);

  // const connectInvitation = await connectionService.receiveInvitation(

  //   "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation", "@id": "e7727db0-93b9-49a2-84b4-35061ce7fdb6",
  // "recipientKeys": ["3oLbdadSKsxrs5izaK
  // dfuRGPZa1TQCNmAbkcJLDtLbXo"], "label": "Faber Agent", "serviceEndpoint": "http:/
  // /192.168.65.3:8020"}
  // );

  // console.log('connection invitation', connectInvitation);

  // const acceptInvitation = await connectionService.acceptInvitation(
  //   connectInvitation.connection_id
  // );
  // console.log('accept invitation', acceptInvitation);

  // const connections = await connectionService.connections();
  // console.log('connections', connections);
  // const id = connections[0].activity[0].connection_id;
  // const connection = await connectionService.connections(id);
  // console.log('connection', connection);
  const connectionModel = new Connection();
  let res = await connectionModel.filterConnectionsByState('active');
  // let filtered = res.filter(itm => itm.)?
  console.log('results', res);
  // res.filter(
  // (itm: any) => itm.connection_id === 'b8c9b728-10f2-4ccd-b324-dd2facf85c4f'
  // );
};

main();
