import { ConnectionService } from '../../agent/modules/connection/connection.service';

const invitationResponseKeys = [
  'connection_id',
  'invitation',
  'invitation_url'
];
const invitationKeys = ['@type', 'recipientkeys', 'label', 'serviceEndpoint'];

export class Invitation {
  _connection = new ConnectionService();
  _invitations = new Invitation();

  constructor() {}
}
