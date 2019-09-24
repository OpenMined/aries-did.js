import { SchemaService } from './schema.service';

const main = async () => {
  const schemaSvc = new SchemaService();
  const schema = await schemaSvc.postSchema({
    attributes: ['degree', 'name', 'age', 'average'],
    schema_name: 'testSchema',
    schema_version: '1.0'
  });
  console.log('schema', schema);
};

main();
