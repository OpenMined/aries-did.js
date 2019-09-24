import * as request from 'superagent';
import { ISchema } from '../core/interfaces/schema.interface';

const apiUrl = 'http://localhost:8051/';

export class SchemaService {
  constructor() {}

  async postSchema(schema: ISchema) {
    try {
      console.log('stringified data', JSON.stringify(schema, null, 2));
      const res = await request
        .post(`${apiUrl}schemas`)
        .send(JSON.stringify(schema));
      return res.body;
    } catch (err) {
      console.log('schema error');

      throw err;
    }
  }

  async getSchemaById(id: string) {
    try {
      const res = await request.get(`${apiUrl}schemas/${id}`);
      return res.body;
    } catch (err) {
      console.log('schema error');
      throw err;
    }
  }
}
