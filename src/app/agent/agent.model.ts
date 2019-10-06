import { Connection } from './modules/connection/connection.model';
import { Schema } from './modules/schema/schema.model';
import { Issue } from './modules/issue/issue.model';
import { CredentialDefinition } from './modules/credential-definition/credential-definition.model';
import { ISchema } from '../core/interfaces/schema.interface';

const moduleKeys = ['connection', 'schema', 'issue', 'credDef'];

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
  private _schemaList: any[] = [];

  get schemaList() {
    return this._schemaList;
  }

  async addSchema(data: any) {
    console.log(data);
    let ret = await this.schema.createSchema(data);
    this._schemaList = [...this._schemaList, ret];
  }

  getModel(key: 'connection' | 'schema' | 'issue' | 'credDef') {
    return this[key];
  }

  constructor(url: string, schema?: ISchema[]) {
    // this.connection = connection;
    this.connection = new Connection(url);
    this.schema = new Schema(url);
    this.issue = new Issue(url);
    this.credDef = new CredentialDefinition(url);
    if (schema) this.loadSchemas(schema);
  }

  private loadSchemas(schemas: ISchema[]) {
    this._schemas = schemas;
    for (let schema of schemas) {
      this.addSchema(schema);
    }
    console.log('loaded schemas', this._schemaList);
  }
}
