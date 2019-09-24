import { SchemaService } from './schema.service';
import { ISchema } from '../../../core/interfaces/schema.interface';

export class Schema {
  private _schemaSvc = new SchemaService();
  private _schemaIds: Set<string> = new Set<string>(null);

  get listSchemaIds() {
    return this._schemaIds.values();
  }

  private _addSchema(id: string) {
    this._schemaIds.add(id);
  }

  private _removeSchema(id: string) {
    this._schemaIds.delete(id);
  }

  // creates a schema and if none is created then it will return an error

  async createSchema(schema: ISchema) {
    try {
      const res = await this._schemaSvc.postSchema(schema);
      if (Object.keys(res).includes('schema_id')) {
        this._addSchema(res.schema_id);
      }
      // TODO: point to documentation on what to troubleshoot if the schema's not creating
      else throw new Error('no schema found');
      return res.schema_id;
    } catch (err) {
      throw err.message;
    }
  }

  constructor() {}
}
