import { ICredentialAttributes } from 'src/app/core/interfaces/issue-credential.interface';

export class Issue {
  private _url: string;
  constructor(url: string) {
    this._url = url;
  }

  private formatInvitation(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes,
    credId: string
  ) {
    return {};
  }

  issueAndSendCred(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes[],
    credId: string
  ) {}
}
