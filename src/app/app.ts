import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as bodyParser from 'koa-bodyparser';

import { clientRoutes, clientMethods } from './client/routes';

const app: Koa = new Koa();
const client = true;
// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status =
      error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
});

// Initial route
// app.use(async (ctx: Koa.Context) => {
//   ctx.body = 'Hello world';
// });

// Middleware
app.use(bodyParser());

if (client) {
  clientRoutes.forEach(route => app.use(route));
  clientMethods.forEach(route => app.use(route));
}

// Application error logging.
app.on('error', console.error);

export default app;
