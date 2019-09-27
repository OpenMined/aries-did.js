import { Schema } from '../schema/schema.model';
import { CredentialDefinitionService } from './credential-definition.service';

export class CredentialDefinition {
  private _credentialDefs = new Set<string>(null);
  _credentialSvc: CredentialDefinitionService;

  constructor(apiUrl: string) {
    this._credentialSvc = new CredentialDefinitionService(apiUrl);
  }

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
      return res;
    } catch (err) {
      return err.message;
    }
  }
}
