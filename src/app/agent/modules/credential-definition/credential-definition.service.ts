import * as request from 'superagent';

const apiUrl = 'http://localhost:8051/';
const segment = 'credential-definitions';

export class CredentialDefinitionService {
  constructor() {}

  /*
    send a credential definition to the ledger. If it exists already it will
    return an existing credential definition
  */
  async sendCredentialDefinition(schemaId: string) {
    try {
      const res = await request
        .post(`${apiUrl}${segment}`)
        .send({ schema_id: schemaId });
      const id = res.body.credential_definition_id;
      // if (!id) throw new Error('no credential id found');
      return id;
    } catch (err) {
      return err.message;
    }
  }

  /*
    get credential definition by id
  */
  async getCredentialDefinition(id: string) {
    try {
      const res = await request.get(`${apiUrl}${segment}/${id}`);
      return res.body;
    } catch (err) {
      return err.message;
    }
  }
}
