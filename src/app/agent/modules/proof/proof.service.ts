import * as request from 'superagent';
import {
  IProofRecordsResponse,
  IProofProposalRequestResponseSend,
  IProposalSend
} from '../../../core/interfaces/proof.interface';

const segment = 'present-proof';
export class ProofService {
  private _url: string;
  constructor(url: string) {
    this._url = url;
  }

  /*
    fetch all present-proof exchange records or a single if it is provided
    @param presExId - presentation exchange id.
  */
  async getProofRecords(presExId?: string): Promise<IProofRecordsResponse> {
    try {
      const baseUrl = this._url + segment + 'records';
      const res = presExId
        ? await request.get(`${baseUrl}/presExId`)
        : await request.get(baseUrl);
      if (!res.body) throw new Error('no records found');
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    fetch credentials for a presentation request from wallet
  */

  async findCredentialsById(presExId: string): Promise<IProofRecordsResponse> {
    try {
      const baseUrl = this._url + segment + 'records/';
      const res = await request.get(`${baseUrl}${presExId}/credentials`);
      if (res.status === 200) return res.body;
      throw new Error('find credentials by Id failed');
    } catch (err) {
      return err;
    }
  }

  /*
    fetch credentials for a presentation request from wallet
    TODO: unsure what this does at it has the same description
      const baseUrl = apiUrl + segment + 'records';

  */

  /*
    send a presentation proposal, include a credential exchange Id
    to respond to a request in reference to a proposal
  */
  async sendProposal(
    data: IProposalSend,
    presExId?: string
  ): Promise<IProofRecordsResponse> {
    try {
      const res = presExId
        ? await request
            .post(`${this._url}${segment}records/${presExId}/send-request`)
            .send(data)
        : await request.post(`${this._url}${segment}send-proposal`).send(data);
      if (res.status === 200) return res.body;
      throw new Error('send proposal failed');
    } catch (err) {
      return err;
    }
  }
  /*
    sends a presentation request in reference to a proposal
    TODO: flesh this out with the correct types
  */

  async sendProof(data: any): Promise<IProofRecordsResponse> {
    try {
      const res = await request
        .post(`${this._url}${segment}records/send-presentation`)
        .send(data);
      if (res.status === 200) return res.body;
      throw new Error('send proof failed');
    } catch (err) {
      return err;
    }
  }

  /*
    verify a received presentation
  */
  async sendProofVerification(
    presExId: string
  ): Promise<IProofRecordsResponse> {
    try {
      const res = await request.post(
        `${this._url}${segment}records/${presExId}/verify-presentation`
      );
      if (res.status === 200) return res.body;
      throw new Error('send proof verification failed');
    } catch (err) {
      return err;
    }
  }

  /*
    remove an existing presentation exchange record
  */
  async removeProofRecord(presExId: string) {
    try {
      const res = await request.post(
        `${this._url}${segment}records/${presExId}/remove`
      );
      if (res.status === 200) return res.body;
      throw new Error('remove proof record failed');
    } catch (err) {
      return err;
    }
  }
}
