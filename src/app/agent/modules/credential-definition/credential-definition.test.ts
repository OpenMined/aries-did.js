import { Schema } from '../schema/schema.model';
import { CredentialDefinition } from './credential-definition.model';

const main = async function() {
  const schema = new Schema();
  const credDef = new CredentialDefinition(schema);
  const schemaDef = {
    attributes: ['degree', 'name', 'age', 'average'],
    schema_name: 'zzz',
    schema_version: '1.0'
  };
  const res = await schema.createSchema(schemaDef);
  const schemas = schema.listSchemaIds;
  // console.log('cred defs schema', schemas);
  const ret = await credDef.createCredentialDefinition(res);
};

main();
