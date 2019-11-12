import { CredentialService } from "./credential.service";
import { ICredentialRecord } from "../../../core/interfaces/issue-credential.interface";

export class Credential {
  _credSvc: CredentialService;

  constructor(apiUrl: string) {
    this._credSvc = new CredentialService(apiUrl);
  }

  async records(opts: { _id?: string } = {}): Promise<ICredentialRecord[]> {
    const { _id } = opts;
    try {
      let res = _id
        ? await this._credSvc.getCredentialById(_id)
        : await this._credSvc.getCredentials();
      return res.body.results ? res.body.results : res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
