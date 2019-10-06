import { Connection } from './modules/connection/connection.model';
import { Schema } from './modules/schema/schema.model';
import { Issue } from './modules/issue/issue.model';
import { CredentialDefinition } from './modules/credential-definition/credential-definition.model';
import { ISchema } from '../core/interfaces/schema.interface';

interface IAgent {
  [key: string]: string;
}

export interface IAgentModel {
  connection: Connection;
  schema: Schema;
  issue: Issue;
  credDef: CredentialDefinition;
  // cred: Credential;
}

export class AgentController implements IAgentModel {
  connection: Connection;
  schema: Schema;
  issue: Issue;
  credDef: CredentialDefinition;
  // cred: Credential;

  private _schemas: ISchema[];
  _schemaList: any[] = [];

  constructor(modules: IAgentModel, schema?: ISchema[]) {
    // this.connection = connection;

    if (schema) this.loadSchemas(schema);
  }

  private loadSchemas(schemas: ISchema[]) {
    this._schemas = schemas;
    for (let schema of schemas) {
      let ret = this.schema.createSchema(schema);
      this._schemaList = [...this._schemaList, ret];
    }
    console.log('loaded schemas', this._schemaList);
  }
}
