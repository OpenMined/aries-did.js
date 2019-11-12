import app from "./app/app";
import hooks from "./app/hooks/hook.controller";
import { config } from "dotenv";

import { resolve } from "path";
config({ path: resolve(__dirname, "./app/config.env") });

import * as cluster from "cluster";
import { execFile } from "child_process";

let ports = [3000, 3001, 3002];

const agents = process.env.AGENT_COUNT || 1;

if (cluster.isMaster) {
  console.log("forked");
  cluster.fork();
} else {
  const id = cluster.worker.id - 1;
  app.listen(ports[id + 1]);
  console.log("app started on", ports[id]);
}
