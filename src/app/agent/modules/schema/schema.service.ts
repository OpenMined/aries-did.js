import * as request from 'superagent';
import { ISchema } from '../../../core/interfaces/schema.interface';

const apiUrl = 'http://localhost:8051/';

export class SchemaService {
  private _apiUrl: string;
  constructor(_apiUrl: string) {
    this._apiUrl = _apiUrl;
  }

  /*
    Post a new schema to the ledger
  */
  async postSchema(schema: ISchema) {
    try {
      const res = await request
        .post(`${apiUrl}schemas`)
        .send(JSON.stringify(schema));
      return res.body;
    } catch (err) {
      console.log('schema error');

      return err;
    }
  }

  /*
    find a schema by it's ID
  */
  async getSchemaById(id: string) {
    try {
      const res = await request.get(`${apiUrl}schemas/${id}`);
      return res.body;
    } catch (err) {
      console.log('schema error');
      return err;
    }
  }
}
