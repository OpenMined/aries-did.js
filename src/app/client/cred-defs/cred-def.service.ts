import { Schema } from '../../agent/modules/schema/schema.model';
import { CredentialDefinition } from '../../agent/modules/credential-definition/credential-definition.model';
import { ISchema } from '../../core/interfaces/schema.interface';

export class CredDefService {
  private _schema: Schema;
  private _credDef: CredentialDefinition;

  constructor(schema: Schema, credDef: CredentialDefinition) {
    this._schema = schema;
    this._credDef = credDef;
  }

  async createCredDef(schema: ISchema): Promise<any> {
    try {
      const sendSchema = {
        schema_version: schema.schema_version,
        schema_name: schema.schema_name,
        attributes: schema.attributes
      };

      const newSchema = await this._schema.createSchema(sendSchema);

      const res = await this._credDef.createCredentialDefinition(
        newSchema.schema_id
      );
      return { id: res.credential_definition_id };
    } catch (err) {
      return err;
    }
  }
}
