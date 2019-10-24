import { CredentialService } from './credential.service';

export class Credential {
  _credSvc: CredentialService;

  constructor(apiUrl: string) {
    this._credSvc = new CredentialService(apiUrl);
  }

  async records() {
    try {
      let res = await this._credSvc.getCredentials();
      return res.body.results;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
