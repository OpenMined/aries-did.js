import { ConnectionService } from './connection.service';
import { Connection } from './connection.model';
import { testData } from './constants';

const invData = testData;

const main = async () => {
  const connection = new Connection();
  // let res = await connection.createInvitation();
  // let fmt = connection.formatInvitation(res);
  // console.log('invitation', fmt);

  // let accept = await connection.invitationResponse(invData);
  // console.log('accepted', accept);
};

main();
