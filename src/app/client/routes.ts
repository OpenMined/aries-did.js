import relationshipsController from './relationships/relationships.controller';

export const clientRoutes = [relationshipsController.routes()];

export const clientMethods = [relationshipsController.allowedMethods()];
