import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as bodyParser from 'koa-bodyparser';

import protocolController from './protocol/protocol.controller';
import { AgentService } from './agent/agent.service';

const app: Koa = new Koa();

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

app.use(protocolController.routes());
app.use(protocolController.allowedMethods());

// Application error logging.
app.on('error', console.error);

const test = new AgentService();

export default app;
