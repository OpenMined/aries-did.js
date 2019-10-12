import { Connection } from './modules/connection/connection.model';
import { Schema } from './modules/schema/schema.model';
import { Issue } from './modules/issue/issue.model';
import { CredentialDefinition } from './modules/credential-definition/credential-definition.model';
import { ISchema } from '../core/interfaces/schema.interface';
import { Proof } from './modules/proof/proof.model';

const moduleKeys = ['connection', 'schema', 'issue', 'credDef'];

export type ModuleType = [
  'connection' | 'schema' | 'issue' | 'credDef' | 'proof'
];

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
  proof: Proof;
  // cred: Credential;

  private _schemas: ISchema[];
  private _schemaList: any[] = [];

  get schemaList() {
    return this._schemaList;
  }

  async addSchema(data: any) {
    let ret = await this.schema.createSchema(data);
    this._schemaList = [...this._schemaList, ret];
  }

  getModel(key: 'connection' | 'schema' | 'issue' | 'credDef' | 'proof') {
    return this[key];
  }

  constructor(url: string, schema?: ISchema[]) {
    // this.connection = connection;
    this.connection = new Connection(url);
    this.schema = new Schema(url);
    this.issue = new Issue(url);
    this.credDef = new CredentialDefinition(url);
    this.proof = new Proof(url, this.schema, this.credDef);
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
