import app from './app/app';
import hooks from './app/hooks/hook.controller';
import { config } from 'dotenv';

import { resolve } from 'path';
config({ path: resolve(__dirname, './app/config.env') });

import * as cluster from 'cluster';
import { execFile } from 'child_process';

let ports = [3000, 3001, 3002];

const agents = process.env.AGENT_COUNT || 1;

if (true) {
  const db = execFile('pouchdb-server --port 5984');
  db.once('close', (code, signal) => console.log('db started'));
  app.listen(3000, () => {
    console.log('app started on', 3000, 'listening on', process.env.HOOKS_PORT);
  });
  // hooks.listen(process.env.HOOKS_PORT);
  // console.log('app started on', 3000, 'listening on', process.env.HOOKS_PORT);
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
