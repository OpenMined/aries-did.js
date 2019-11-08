import 'mocha';

import { expect } from 'chai';

import dataStore, { ICredDef } from './db';
import { AgentController } from '../agent/agent.model';

const store = dataStore;

const prefix = 'DB: ';

const dbprefix = 'cdef';

describe(prefix + 'model tests', function() {
  it(prefix + 'should delete all records', function() {
    // store.cleanDatabase().then(itm => console.log(itm));
  });
  it(prefix + 'should insert a record', function() {
    const record = {
      name: 'cred def',
      version: '1.0',
      attributes: ['xyz', 'abc'],
      schema_id: 'xyz',
      _id: 'string13df213'
    };
    const prefix = 'cdef';

    store
      .insertRecord({ prefix, record })
      .then(itm => itm)
      .catch(err => console.log('the error', err));
  });
  it(prefix + 'should get all records', function() {
    store.getRecords({ prefix: 'cdef' }).then();
  });
  it(prefix + 'should sync data', function() {
    let credSync = async (id: string): Promise<boolean> => {
      const ctrl = new AgentController('http://localhost:8051/');
      let record = await ctrl.credDef.getCredentialDefinition(id);
      console.log('the record', record);
      if (!record) return false;
      return true;
    };
    store.syncRecords({
      prefix: 'cdef',
      func: credSync
    });
  });
});
