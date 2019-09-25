import * as request from 'superagent';
import {
  ICredentialRecord,
  ICredentialSend,
  ICredentialSendResponse,
  ICredentialSendProposalResponse,
  ICredExRecordResponse
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
      if (!res.body) throw new Error('no credential records found');
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
      if (!res.body) throw new Error('no credentials created');
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
      if (!res.body) throw new Error('no credential created');
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
      if (!res.body) throw new Error('no offer sent');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    send holder a credential offer in reference to a proposal
    this will come in automatically from the webhook
    The agent will store the credex and will also send webhook message
    the id required is a credential exchange id
  */

  async sendCredInRefToProposal(id: string) {
    try {
      const res = await request.post(
        `${apiUrl}${segment}records/${id}/send-offer`
      );
      if (!res.body) throw new Error('no cred proposal response sent');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    send holder a credential request
    @param id: credex id
  */

  async sendCredRequest(id: string) {
    try {
      const res = await request.post(
        `${apiUrl}${segment}records/${id}/send-request`
      );
      if (!res.body) throw new Error('no cred request returned');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    send a credential
    @param id: credex id
  */

  async sendCredential(id: string) {
    try {
      const res = await request.post(`${apiUrl}${segment}/records/${id}/issue`);
      if (!res.body) throw new Error('no cred sent');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    store a received credential
    @param: credex id
  */

  async storeCredential(id: string) {
    try {
      const res = await request.post(`${apiUrl}${segment}/records/${id}/store`);
      if (!res.body) throw new Error('credential not stored');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    send a problem report for credential exchange
    TODO: according to the swagger this is a null return
    @param id - credexid
  */

  async sendProblemReport(id: string, explain_ltxt: string) {
    try {
      const res = await request
        .post(`${apiUrl}${segment}records/${id}/problem-report`)
        .send({ explain_ltxt });
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    remove an existing credential exchange record
  */

  async removeCredential(id: string) {
    try {
      const res = await request.post(`${apiUrl}${segment}${id}/remove`);
      if (!res.body) throw new Error();
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /* 
    fetch a single credential exchange record
    @param: id - credex id
  */

  async getCredexRecord(id: string): Promise<ICredExRecordResponse> {
    try {
      const res = await request.post(`${apiUrl}${segment}records/${id}`);
      if (!res.body) throw new Error();
      return res.body;
    } catch (err) {
      return err;
    }
  }
}
