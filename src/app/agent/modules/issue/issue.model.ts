import {
  ICredentialAttributes,
  IIssueSend,
  IIssueOffer
} from 'src/app/core/interfaces/issue-credential.interface';
import { IssueService } from './issue.service';

export class Issue {
  private _issueSvc: IssueService;
  constructor(url: string) {
    this._issueSvc = new IssueService(url);
  }

  private formatSendCred(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes[],
    credDefId: string
  ): IIssueSend | null {
    const formatAttrs = this.formatAttrs(attrs);
    if (Array.isArray(formatAttrs)) {
      return {
        connection_id: connId,
        comment,
        credential_definition_id: credDefId,
        credential_proposal: {
          attributes: formatAttrs
        }
      };
    } else return null;
  }

  private formatSendOffer(
    connection_id: string,
    comment: string,
    attributes: ICredentialAttributes[],
    credential_definition_id: string,
    autoIssue: boolean = true
  ): IIssueOffer {
    return {
      connection_id,
      comment,
      credential_definition_id,
      credential_preview: {
        attributes: attributes
      },
      'auto-issue': autoIssue
    };
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
      value: attrs.value
    };
  }

  async issueAndSendCred(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes[],
    credDefId: string
  ) {
    const cred = this.formatSendCred(connId, comment, attrs, credDefId);
    try {
      if (cred != null) {
        // console.log('credential definition', cred);
        return await this._issueSvc.issueCredentialSend(cred);
      } else {
        throw new Error('cred not defined');
      }
    } catch (err) {
      return err;
    }
  }

  async issueOfferSend(
    connId: string,
    comment: string,
    attrs: ICredentialAttributes[],
    credDefId: string
  ) {
    const credOffer = this.formatSendOffer(connId, comment, attrs, credDefId);
    try {
      if (credOffer != null) {
        const res = await this._issueSvc.sendOffer(credOffer);
        console.log('issue offer send result', res);
        return res.body;
      } else {
        throw new Error('cred offer not defined');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async sendOfferById(credExId: string) {
    try {
      let res = await this._issueSvc.postById(credExId, 'send-offer');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async sendRequestById(credExId: string) {
    try {
      let res = await this._issueSvc.postById(credExId, 'send-request');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async sendIssueById(credExId: string) {
    try {
      let res = await this._issueSvc.postById(credExId, 'issue');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async sendStoreById(credExId: string) {
    try {
      let res = await this._issueSvc.postById(credExId, 'store');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async removeById(credExId: string) {
    try {
      let res = await this._issueSvc.postById(credExId, 'remove');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
