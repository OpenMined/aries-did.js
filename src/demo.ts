import * as cluster from 'cluster';

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, './app/config.env') });

import app from './app/app';
import { execFile, exec } from 'child_process';

let ports = [3000, 3001, 3002];

if (cluster.isMaster) {
  // for(let)
  for (let port of ports) {
    const env = process.env;
    env.PORT = port.toString();
    cluster.fork(env);
  }
} else {
  app.listen(process.env.PORT, () => {
    console.log('worker process', cluster.worker.id);
    console.log('app started on', process.env.PORT);
  });
}
