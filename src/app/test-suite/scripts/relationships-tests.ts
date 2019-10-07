import AgentConfig from '../../config';
import { Connection } from '../../agent/modules/connection/connection.model';

const agentConfig = new AgentConfig();

const alice = new Connection(agentConfig.agentUrl);
const faber = new Connection(agentConfig.testAgentUrl);
const acme = new Connection(agentConfig.acmeAgentUrl);

const createIvitation = () => {};

const acceptInvitation = () => {};

const newRelationship = (sender: Connection, receiver: Connection) => {
  let connectionId: string;
  sender.createInvitation().then(itm => {
    receiver.invitationResponse(itm).then(accept => {
      receiver.acceptInvitation(accept.connection_id).then(itm => {
        sender.getConnections({ state: 'request' }).then(itms => {
          if (Array.isArray(itms)) {
            sender.requestResponse(itms[0].connection_id).then(itm => {});
          }
        });
      });
    });
  });
};

newRelationship(alice, faber);
newRelationship(acme, alice);
