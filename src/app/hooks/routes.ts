import connectionsController from './modules/connections/connections.controller';
import issuesController from './modules/issue-credential/issue-credential.controller';
import messagesController from './modules/basic-messages/basic-messages.controller';
import proofController from './modules/present-proof/present-proof.controller';

export const routes = [
  connectionsController.routes(),
  issuesController.routes(),
  messagesController.routes(),
  proofController.routes()
];

export const allowedMethods = [
  connectionsController.allowedMethods(),
  issuesController.allowedMethods(),
  messagesController.allowedMethods(),
  proofController.allowedMethods()
];
