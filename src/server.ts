import app from './app/app';
import hooks from './app/hooks/hook.controller';
import { config } from 'dotenv';

import { resolve } from 'path';
config({ path: resolve(__dirname, './config.env') });

import * as cluster from 'cluster';

let ports = [3000, 3001, 3002];

const agents = process.env.AGENT_COUNT || 1;

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
