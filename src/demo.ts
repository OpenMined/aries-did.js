import * as cluster from 'cluster';

import { exec, execSync, execFile, spawn } from 'child_process';

// config({ path: resolve(__dirname, '../app/config.env') });

let ports = [3000, 3001, 3002];

const agents = process.env.AGENT_COUNT || 1;

if (cluster.isMaster) {
  const agentConfig = [
    {
      agent: 'alice',
      port: 3000,
      hookPort: 3050,
      child: `PORTS='8051:8051 8050:8050' c:/users/seanh/projects/node-aries-controller/aries-cloudagent-python/docker/manage start --inbound-transport http '0.0.0.0' 8050 --outbound-transport http --admin-insecure-mode --admin '0.0.0.0' 8051 --seed the_org_book_0000000000000000003 --genesis-url 'http://192.168.65.3:9000/genesis' --endpoint 'http://192.168.65.3:8050' --wallet-type indy --label 'AliceSmith' --auto-accept-invites --auto-accept-requests --webhook-url http://host.docker.internal:3050`
    },
    {
      agent: 'faber',
      port: 3001,
      hookPort: 3051,
      child: `PORTS='8021:8021 8020:8020' c:/users/seanh/projects/node-aries-controller/aries-cloudagent-python/docker/manage start --inbound-transport http '0.0.0.0' 8020 --outbound-transport http --admin-insecure-mode --admin '0.0.0.0' 8021 --seed the_org_book_0000000000000000002 --genesis-url 'http://192.168.65.3:9000/genesis' --endpoint 'http://192.168.65.3:8020' --wallet-type indy --label 'Faber' --auto-accept-invites --auto-accept-requests --webhook-url http://host.docker.internal:3051`
    },
    {
      agent: 'acme',
      port: 3002,
      hookPort: 3052,
      child: `PORTS='8031:8031 8030:8030' sh manage start --inbound-transport http '0.0.0.0' 8030 --outbound-transport http --admin-insecure-mode --admin '0.0.0.0' 8031 --seed the_org_book_0000000000000000004 --genesis-url 'http://192.168.65.3:9000/genesis' --endpoint 'http://192.168.65.3:8030' --wallet-type indy --label 'Acme' --webhook-url http://host.docker.internal:3052`
    }
  ];

  const db = execFile('pouchdb-server --port 5984');
  db.once('close', (code, signal) => console.log('db started'));

  const agent = exec(
    `cd aries-cloudagent-python/docker && PORTS='8031:8031 8030:8030' sh manage start --inbound-transport http '0.0.0.0' 8030 --outbound-transport http --admin-insecure-mode --admin '0.0.0.0: 8031 --seed the_org_book_0000000000000000004 --genesis-url 'http://192.168.65.3:9000/genesis' --endpoint 'http://192.168.65.3:8030' --wallet-type indy --label 'Acme' --webhook-url http://host.docker.internal:3052`,
    {
      shell: `C:/Program Files/Git/bin/bash.exe`,
      windowsHide: true
    }
  );
  agent.on('close', () => {
    console.log('agent start');
    exec(agentConfig[1].child, {
      shell: 'c:/program files/git/bin/bash.exe',
      windowsHide: true
    });
  });

  // aliceAgent.addListener('message', (message, handle) => {
  //   console.log('alice listener', message);
  // });

  // aliceAgent.process.send(agentConfig[0], err => console.log(err));
  // const faberAgent = cluster.fork();
  // faberAgent.addListener('message', (message, handle) => {
  //   console.log('faber listener', message);
  // });
  // const acmeAgent = cluster.fork();
  // acmeAgent.addListener('message', (message, handle) => {
  //   console.log('acme listener', message);
  // });
  // [aliceAgent, faberAgent, acmeAgent].forEach((child, i) => {
  //   child.on('online', () => child.process.send(agentConfig[i]));
  // });
  // events.addListener('agent', () => {
  //   events.removeAllListeners();
  // });
} else {
  cluster.worker;
  const id = cluster.worker.id - 1;
  // cluster.worker.emit
  cluster.worker.process.addListener('message', (message, handle) => {
    if (message.agent === 'alice') {
    }
  });
}
