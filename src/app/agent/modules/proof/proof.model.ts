import { ProofService } from './proof.service';
import { IProposalSend } from 'src/app/core/interfaces/proof.interface';

export class Proof {
  _proofSvc: ProofService;
  constructor(apiUrl: string) {
    this._proofSvc = new ProofService(apiUrl);
  }

  async allProofRecords() {
    return await this._proofSvc.getProofRecords();
  }

  async proofRecord(id: string) {
    return await this._proofSvc.getProofRecords(id);
  }

  async sendProof(data: any) {
    return await this._proofSvc.sendProof(data);
  }

  async sendProposal(data: IProposalSend) {
    return await this._proofSvc.sendProposal(data);
  }

  async sendProofVerification(id: string) {
    return await this._proofSvc.sendProof(id);
  }
}
