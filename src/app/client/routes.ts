import relationshipsController from './relationships/relationships.controller';
import invitationsController from './invitations/invitations.controller';

export const clientRoutes = [
  relationshipsController.routes(),
  invitationsController.routes()
];

export const clientMethods = [
  relationshipsController.allowedMethods(),
  invitationsController.allowedMethods()
];
