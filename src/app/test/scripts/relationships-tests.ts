import AgentConfig from '../../config';
import { Connection } from '../../agent/modules/connection/connection.model';

const agentConfig = new AgentConfig();

const connection = new Connection(agentConfig.agentUrl);
const testConnection = new Connection(agentConfig.testAgentUrl);

const createIvitation = () => {};

const acceptInvitation = () => {};

const newInvitation = (sender: Connection, receiver: Connection) => {
  let connectionId;
  sender.createInvitation().then(itm =>
    receiver.invitationResponse(itm).then(accept => {
      console.log(accept);
    })
  );
  // sender.getConnections().then(itm => console.log(itm));
};

newInvitation(connection, testConnection);
