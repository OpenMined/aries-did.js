import AgentConfig from '../../config';

import { expect } from 'chai';
import 'mocha';

const request = require('supertest');

import app from '../../../app/app';

import { IInvitation } from 'src/app/core/interfaces/invitation-request.interface';
import { Connection } from '../../agent/modules/connection/connection.model';

const agent = new AgentConfig();

const testAgent = new Connection(agent.testAgentUrl);
const agentConn = new Connection(agent.agentUrl);

let invite: IInvitation;

before('start app server', async function() {
  invite = await testAgent.createInvitation();
});

describe('API should handle relationships', async function() {
  it('should get an array of relationships', async function() {
    const relationships = await request(app.callback()).get('/relationships');
    expect(relationships.body).to.be.an('array');
  });
  it('should get a single relationship record', async function() {
    // const received = await agentConn.invitationResponse(invite);
    // const record = await request(app.callback()).get(
    //   `/relationships?id=${received.connection_id}`
    // );
    // expect(record.body.connection_id).to.exist;
  });
});
