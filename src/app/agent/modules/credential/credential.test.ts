import 'mocha';

import { expect } from 'chai';

import { Credential } from './credential.model';
import AgentConfig from '../../../config';

const agentConfig = new AgentConfig();

const credential = new Credential(agentConfig.testAgentUrl);

const prefix = 'CREDENTIAL: ';

describe(`${prefix}model tests`, function() {
  it.skip(`${prefix}should get a list of active credentials`, async function() {
    let res = await credential.records();
    expect(res).to.not.be.empty;
  });
});
