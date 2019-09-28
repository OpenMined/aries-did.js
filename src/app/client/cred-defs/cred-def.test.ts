import AgentConfig from '../../config';
import { expect } from 'chai';
import 'mocha';
const request = require('supertest');

import app from '../../../app/app';

const agent = new AgentConfig();

let server: any;

const schemaDef = {
  attributes: ['abc'],
  schema_version: '1.0',
  schema_name: 'test'
};

before('start app server', async function() {
  server = app.listen(agent.port);
});

describe('create new credential definition from API', async function() {
  it('should return a cred-def id', async function() {
    const res = await request(server)
      .post('/credential-definitions')
      .send(schemaDef);
    console.log('the real result', res.body);
    expect(res.body).to.haveOwnProperty('id');
    expect(res.body.id).to.not.be.empty;
  });
  it('should not return a cred-def id', async function() {
    const res = await request(server).post('/credential-definitions');
    expect(res.body).to.be.empty;
  });
});
after('close server', function() {
  server.close();
});
