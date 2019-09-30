import AgentConfig from '../../config';
import { expect } from 'chai';
import 'mocha';
const request = require('supertest');

import app from '../../../app/app';
import { IInvitation } from '../../../app/core/interfaces/invitation-request.interface';
import { Connection } from '../../../app/agent/modules/connection/connection.model';

const agent = new AgentConfig();

const testAgent = new Connection(agent.testAgentUrl);

let server: any;
let invite: IInvitation;

before('start app server', async function() {
  server = app.listen(agent.port);
  invite = await testAgent.createInvitation();
});

describe('API should handle invitations', async function() {
  it('should create an invitation', async function() {
    const res = await request(server).post('/invitations');
    expect(res.body).to.haveOwnProperty('id');
    expect(res.body['id']).to.not.be.empty;
  });
  it('should receive an invitation', async () => {
    const res = await request(server)
      .post('/invitations?accept=true')
      .send(invite);

    expect(res.body.status).to.not.equal(500);
    expect(res.body.state).to.equal('request');
  });
});
after('close server', function() {
  server.close();
});
