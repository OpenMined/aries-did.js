import relationshipsController from './relationships/relationships.controller';
import invitationsController from './invitations/invitations.controller';
import credDefController from './cred-defs/cred-def.controller';
import credsController from './credentials/credentials.controller';
import issuesController from './issues/issues.controller';
import messagesController from './messages/messages.controller';

export const clientRoutes = [
  relationshipsController.routes(),
  invitationsController.routes(),
  credDefController.routes(),
  credsController.routes(),
  issuesController.routes(),
  messagesController.routes()
];

export const clientMethods = [
  relationshipsController.allowedMethods(),
  invitationsController.allowedMethods(),
  credDefController.allowedMethods(),
  credsController.allowedMethods(),
  issuesController.allowedMethods(),
  messagesController.allowedMethods()
];
