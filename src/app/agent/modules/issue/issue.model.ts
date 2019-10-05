import {
  ICredentialAttributes,
  IIssueSend
} from 'src/app/core/interfaces/issue-credential.interface';
import { IssueService } from './issue.service';

export class Issue {
  private _issueSvc: IssueService;
  constructor(url: string) {
    this._issueSvc = new IssueService(url);
  }

  private formatInvitation(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes[],
    credId: string
  ): IIssueSend | null {
    const formatAttrs = this.formatAttrs(attrs);
    if (Array.isArray(formatAttrs)) {
      return {
        connection_id: connId,
        comment,
        credential_definition_id: {
          credential_definition_id: credId
        },
        credential_proposal: {
          '@type':
            'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview',
          attributes: formatAttrs
        }
      };
    } else return null;
  }

  private formatAttrs(attrs: ICredentialAttributes | ICredentialAttributes[]) {
    if (Array.isArray(attrs)) {
      let retAttrs: ICredentialAttributes[] = [];
      for (let attr of attrs) {
        let res = this.formatAttrs(attr) as any;
        retAttrs.push(res);
      }
      return retAttrs;
    }

    return {
      name: attrs.name,
      value: attrs.value,
      'mime-type': 'image/url'
    };
  }

  async issueAndSendCred(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes[],
    credId: string
  ) {
    const cred = this.formatInvitation(connId, comment, attrs, credId);
    try {
      if (cred != null) {
        return await this._issueSvc.issueCredentialSend(cred);
      } else {
        throw new Error('cred not defined');
      }
    } catch (err) {
      return err;
    }
  }
}
