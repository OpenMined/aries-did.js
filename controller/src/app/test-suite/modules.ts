import { Connection } from '../agent/modules/connection/connection.model';
import { Schema } from '../agent/modules/schema/schema.model';
import { Issue } from '../agent/modules/issue/issue.model';
import { CredentialDefinition } from '../agent/modules/credential-definition/credential-definition.model';

const createModules = (agentUrl: string) => {
  const connection = new Connection(agentUrl);
  const schema = new Schema(agentUrl);
  const issue = new Issue(agentUrl);
  const credDef = new CredentialDefinition(agentUrl);
  return { connection, schema, issue, credDef };
};

export { createModules };
