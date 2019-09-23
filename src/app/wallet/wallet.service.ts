import * as request from 'superagent';

const apiUrl = 'http://localhost:8051/';

export class WalletService {
  constructor() {}

  async getDids() {
    try {
      const res = await request.get(`${apiUrl}wallet/did`);
      return res.body;
    } catch (err) {
      throw err;
    }
  }

  async createDid() {
    try {
      const res = await request.post(`${apiUrl}wallet/did/create`);
      return res.body;
    } catch (err) {
      throw err;
    }
  }

  async getPublicDid() {
    try {
      const res = await request.get(`${apiUrl}wallet/did/public`);
      return res.body;
    } catch (err) {
      throw err;
    }
  }

  async assignPublicWalletDid(did: string) {
    try {
      const res = await request
        .post(`${apiUrl}wallet/did/public`)
        .query({ did });
      return res.body;
    } catch (err) {
      throw err;
    }
  }
}
