import { SchemaService } from './schema.service';
import { Schema } from './schema.model';
import { CredentialDefinition } from '../credential-definition/credential-definition.model';

const main = async () => {
  const schema = new Schema();
  const schemaDef = {
    attributes: ['degree', 'name', 'age', 'average'],
    schema_name: 'zzz',
    schema_version: '1.0'
  };
  const res = await schema.createSchema(schemaDef);
  const schemas = schema.listSchemaIds;
  const credDef = new CredentialDefinition(schema);
};

main();
