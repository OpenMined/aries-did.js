import app from './app/app';
import { config } from 'dotenv';

import { resolve } from 'path';
config({ path: resolve(__dirname, './config.env') });

import * as cluster from 'cluster';

const numCPUs = require('os').cpus().length;

const PORT: number = Number(process.env.PORT) || 3000;

let ports = [3000, 3001, 3002];

const agents = process.env.AGENT_COUNT || 1;

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
