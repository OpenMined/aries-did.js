import * as request from 'superagent';

const apiUrl = 'http://localhost:8051/';
const segment = 'credential/';

export class ControllerService {
  constructor() {}

  async getCredentialById(id: string) {
    try {
      const res = await request.get(`${apiUrl}${segment}${id}`);
      return res.body;
    } catch (err) {
      throw err.message;
    }
  }

  async removeCredentialById(id: string) {
    try {
      const res = await request.post(`${apiUrl}${segment}${id}`);
      return res.body;
    } catch (err) {
      throw err.message;
    }
  }

  async getCredentials() {
    try {
      const res = await request.get(`${apiUrl}${segment}`);
      return res.body;
    } catch (err) {
      throw err.message;
    }
  }
}
