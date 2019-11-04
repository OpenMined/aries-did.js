import * as cluster from 'cluster';

import { config } from 'dotenv';
import { resolve } from 'path';

import app from './app/app';
import hooks from './app/hooks/hook.controller';

config({ path: resolve(__dirname, './config.env') });

let ports = [3000, 3001, 3002];

const agents = process.env.AGENT_COUNT || 1;

// const server = new http.Server(app.callback());
// const whServer = new http.Server(hooks.callback());

// const socket = io(server);

if (process.env.single === 'true') {
  app.listen(3000);
  hooks.listen(process.env.HOOKS_PORT);
  console.log('app started on', 3000, 'listening on', process.env.HOOKS_PORT);
} else {
  if (cluster.isMaster) {
    for (let i = 0; i < agents; i++) {
      console.log('forked');
      cluster.fork();
    }
  } else {
    const id = cluster.worker.id - 1;
    app.listen(ports[id]);
    console.log('app started on', ports[id]);
  }
}
