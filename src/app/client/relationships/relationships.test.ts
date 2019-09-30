import AgentConfig from '../../config';

import { expect } from 'chai';
import 'mocha';

const request = require('supertest');

import app from '../../../app/app';

import { IInvitation } from 'src/app/core/interfaces/invitation-request.interface';
import { Connection } from '../../agent/modules/connection/connection.model';

const agent = new AgentConfig();

const testAgent = new Connection(agent.testAgentUrl);

let server: any;
let invite: IInvitation;

before('start app server', async function() {
  // server = app.listen(agent.port);
  // invite = await testAgent.createInvitation();
});

describe('API should handle relationships', async function() {
  // console.log('server', server);

  const relationships = await request(app.callback()).get('/relationships');
  expect(relationships.body).to.be.an('array');
});
