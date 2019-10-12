import * as request from 'superagent';

const segment = 'credential/';

export class CredentialService {
  private _url: string;
  constructor(apiUrl: string) {
    this._url = apiUrl;
  }

  async getCredentialById(id: string) {
    try {
      const res = await request.get(`${this._url}${segment}${id}`);
      return res.body;
    } catch (err) {
      throw err.message;
    }
  }

  async removeCredentialById(id: string) {
    try {
      const res = await request.post(`${this._url}${segment}${id}`);
      return res.body;
    } catch (err) {
      throw err.message;
    }
  }

  async getCredentials() {
    try {
      const res = await request.get(`${this._url}${segment}`);
      return res.body;
    } catch (err) {
      throw err.message;
    }
  }
}
