import {
  IIssueSend,
  IIssueOffer
} from 'src/app/core/interfaces/issue-credential.interface';
import * as request from 'superagent';

export type IssueCredByIdRouteType =
  | 'send-offer'
  | 'send-request'
  | 'issue'
  | 'store'
  | 'remove';

export class IssueService {
  private _url: string;
  private _segment: string = 'issue-credential/';

  constructor(url: string) {
    this._url = url;
  }

  async getIssueCredentialRecords() {
    try {
      return await request.get(`${this._url}${this._segment}records`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async issueCredentialSend(cred: IIssueSend) {
    try {
      return await request.post(`${this._url}${this._segment}send`).send(cred);
    } catch (err) {
      return err;
    }
  }

  async sendOffer(cred: IIssueOffer) {
    try {
      return await request
        .post(`${this._url}${this._segment}send-offer`)
        .send(cred);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async postById(credExId: string, route: IssueCredByIdRouteType) {
    try {
      // console.log(`${this._url}${this._segment}records/${credExId}/${route}`);
      return await request.post(
        `${this._url}${this._segment}records/${credExId}/${route}`
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
