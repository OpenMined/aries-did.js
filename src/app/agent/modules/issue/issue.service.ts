import * as request from 'superagent';
import {
  ICredentialRecord,
  ICredentialSend,
  ICredentialSendResponse,
  ICredentialSendProposalResponse
} from '../../../core/interfaces/issue-credential.interface';

const apiUrl = 'http://localhost:8051/';
const segment = 'issue-credential/';

export class IssueService {
  constructor() {}

  /* 
  Get attribute MIME types from wallet
  */
  async getAttributeMimeTypesByCredID(id: string) {
    try {
      const res = await request.get(`${apiUrl}${segment}id`);
      return res;
    } catch (err) {
      return err;
    }
  }

  /*
    fetch all credential exchange records
  */

  async getCredExRecords(): Promise<ICredentialRecord[]> {
    try {
      const res = await request.get(`${apiUrl}${segment}records`);
      if (!res) throw new Error('no credential records found');
      return res.body.results;
    } catch (err) {
      return err;
    }
  }
  /*
    send credential automating entire flow
  */
  async sendCred(data: ICredentialSend): Promise<ICredentialSendResponse> {
    try {
      const res = await request.post(`${apiUrl}${segment}send`).send(data);
      if (!res) throw new Error('no credentials created');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    send issuer a credential proposal
  */

  async sendCredProposal(
    data: ICredentialSend
  ): Promise<ICredentialSendProposalResponse> {
    try {
      const res = await request
        .post(`${apiUrl}${segment}send-proposal`)
        .send(data);
      if (!res) throw new Error('no credential created');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    send holder a credential offer free from reference to any proposal
  */

  async sendOffer(data: ICredentialSend) {
    try {
      const res = await request
        .post(`${apiUrl}${segment}send-offer`)
        .send(data);
      if (!res) throw new Error('no offer sent');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    send holder a credential offer in reference to a proposal
    this will come in automatically from the webhook
    The agent will store the credex and will also send webhook message
  */

  async sendCredInRefToProposal(id: string) {
    try {
      const res = await request.post(
        `${apiUrl}${segment}records/${id}/send-offer`
      );
      if (!res) throw new Error('no cred proposal response sent');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    send holder a credential request
  */

  /*
    send a credential request
  */

  /*
    send a credential
  */

  /*
    store a received credential
  */

  /*
    send a problem report for credential exchange
  */

  /*
    remove an existing credential exchange record
  */
}
