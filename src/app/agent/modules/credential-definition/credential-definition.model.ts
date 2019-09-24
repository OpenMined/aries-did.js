import { Schema } from '../schema/schema.model';
import { CredentialDefinitionService } from './credential-definition.service';
import { SchemaService } from '../schema/schema.service';

export class CredentialDefinition {
  private _credentialSvc = new CredentialDefinitionService();
  private _credentialDefs = new Set<string>(null);
  private _schema: Schema;

  private _addCredDef(id: string) {
    this._credentialDefs.add('id');
  }

  private _removeCredDef(id: string) {
    const bool = this._credentialDefs.delete(id);
    if (!bool) throw new Error('credential not added');
  }

  async createCredentialDefinition(id: string) {
    try {
      const res = await this._credentialSvc.sendCredentialDefinition(id);
      if (!res) throw new Error('no credential');
      this._addCredDef(res);
      return res;
    } catch (err) {
      return err.message;
    }
  }

  constructor(schema?: Schema) {
    this._schema = schema || new Schema();
  }
}
