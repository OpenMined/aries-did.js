import * as request from 'superagent';
import {
  IProofRecordsResponse,
  IProofProposalRequestResponseSend,
  IProposalSend,
  IProofRequest
} from '../../../core/interfaces/proof.interface';

export type ProofPostRouteSegmentType =
  | 'send-request'
  | 'send-presentation'
  | 'verify-presentation'
  | 'remove';

const segment = 'present-proof/';
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

  async getCredentials(presExId: string): Promise<IProofRecordsResponse> {
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
  async postProof(
    proof: IProofRequest<any>,
    segment?: 'send-proposal' | 'send-request'
  ) {
    try {
      const res = segment
        ? await request.post(`${this._url}${segment}`).send(proof)
        : await request.post(`${this._url}send-request`).send(proof);
      if (res.status !== 200) {
        console.log('post proof request', res);
        throw new Error(
          `Error getting proof request with status ${res.status}`
        );
      }
      return res;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /*
    send a presentation proposal, include a credential exchange Id
    to respond to a request in reference to a proposal
  */
  async postByPresExId(
    data: IProposalSend,
    segment: ProofPostRouteSegmentType,
    presExId: string
  ): Promise<IProofRecordsResponse> {
    try {
      const res = await request
        .post(`${this._url}${segment}records/${presExId}/${segment}`)
        .send(data);
      if (res.status === 200) return res.body;
      throw new Error(`send proposal failed with status ${res.status}`);
    } catch (err) {
      return err;
    }
  }

  /*
  remove proof by Id
  */
  async remove(presExId: string) {
    try {
      let res = await request.post(`${this._url}records/${presExId}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
