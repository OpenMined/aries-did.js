import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';

import { routes, allowedMethods } from './routes';

const app: Koa = new Koa();
const client = true;
// Generic error handling middleware.

const options = {
  origin: '*',
  allowHeaders: [
    'Content-Type',
    'content-type',
    'Authorization',
    'Accept',
    'Origin'
  ],
  allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS'
};
app.use(bodyParser());

app.use(cors(options));

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

routes.forEach(route => app.use(route));
allowedMethods.forEach(method => app.use(method));

// Application error logging.
app.on('error', console.error);

export default app;
