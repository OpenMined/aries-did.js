import { Schema } from './schema.model';
import TestAgentConfig from '../../agent-test-config';
import { expect } from 'chai';
import 'mocha';

const agentConfig = new TestAgentConfig();
const schema = new Schema(agentConfig.agentUrl);

let schemaId: string;

describe('create new schema', async function() {
  it('should return a schema id', async function() {
    const schemaDef = {
      attributes: ['name', 'score', 'issued'],
      schema_name: 'SchoolSchema',
      schema_version: '1.0'
    };
    const res = await schema.createSchema(schemaDef);
    expect(res).to.not.be.undefined;
    expect(res).to.haveOwnProperty('schema_id');
    schemaId = res.schema_id;
  });
  it('should not return a schema id', async function() {
    const res = await schema.createSchema({
      attributes: [],
      schema_name: '',
      schema_version: ''
    });
    expect(res).to.not.haveOwnProperty('schema_id');
  });
  it('should return a credDef id', async function() {
    const res = await schema.getSchemaById(schemaId);
    expect(res).to.not.be.undefined;
    expect(res).to.be.an.instanceof(Object);
  });
});
