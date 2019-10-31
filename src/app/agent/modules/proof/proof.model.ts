import { ProofService } from './proof.service';
import {
  IProofRequest,
  IProofRecord
} from '../../../core/interfaces/proof.interface';
import { Schema } from '../schema/schema.model';
import { CredentialDefinition } from '../credential-definition/credential-definition.model';
import { ISchema } from '../../../core/interfaces/schema.interface';
import * as uuid from 'uuid/v1';

/*
  the chain for creating proof requests requires an established relationships
  and a credential.

  the chain typically goes

  send proof presentiation request free of any presentation (no presexid) then verify the received presentation> 

  build the 

*/
interface IObject {
  [key: string]: string;
}

export class Proof {
  private _schema: Schema;
  private _credDef: CredentialDefinition;
  private _proofSvc: ProofService;

  /*
    unimplemented methods
  */

  sendProposal() {
    return 'method not implemented';
  }

  constructor(apiUrl: string, schema: Schema, credDef: CredentialDefinition) {
    this._schema = schema;
    this._credDef = credDef;
    this._proofSvc = new ProofService(apiUrl);
  }

  async records(): Promise<IProofRecord[]> {
    try {
      let res = await this._proofSvc.getProofRecords();
      if (res.body.results) return res.body.results;
      return res.body;
    } catch (err) {
      throw new Error('error in records with message: ' + err.message);
    }
  }

  async getRecordById(id: string) {
    let res = await this._proofSvc.getProofRecords(id);
    return res.body;
  }

  /*
    build a proof request values for a new proof request
  */

  async buildProofRequest(
    schema: ISchema,
    connection_id: string,
    name: string,
    names: string[]
  ): Promise<any> {
    let requested_attributes: any = {};

    const schemaResponse = await this._schema.createSchema(schema);
    const credDef = await this._credDef.createCredentialDefinition(
      schemaResponse.schema_id
    );

    const proofRequest = {
      version: '1.0',
      connection_id,
      proof_request: {
        requested_attributes: {},
        requested_predicates: {},
        name
      }
    };
    for (let val of names) {
      requested_attributes[uuid()] = {
        name: val,
        restrictions: {
          schema_name: schema.schema_name,
          schema_version: schema.schema_version,
          credential_definition_id: credDef.credential_definition_id
        }
      };
    }
    proofRequest.proof_request.requested_attributes = requested_attributes;
    return proofRequest;
  }

  /*
    send a proof request free from proposal or
    include an ID to send in response to a proposal.
  */

  async sendProofRequest(proofRequest: IProofRequest<any>, presExId?: string) {
    try {
      const res = await this._proofSvc.postProof(proofRequest);
      if (res.status === 200) return res.body;
      else
        throw new Error(
          `Proof request presentation failed with status ${res.status}`
        );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /*
    send a verification of the proof request received from the foreign agent
  */

  async verifyProofRequest(id: string) {
    try {
      let res = await this._proofSvc.postByPresExId('verify-presentation', id);
      return res;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async removeAllProofRequests() {
    const results = await this._proofSvc.getProofRecords();
    const requests = results.body.results;
    if (Array.isArray(requests)) {
      for (const request of requests) {
        await this._proofSvc.remove(request.presentation_exchange_id);
      }
    }
    return;
  }

  async removeProof(id: string) {
    let res = await this._proofSvc.remove(id);
    return res.body;
  }

  sendPresentation(id: string) {
    return 'method not implemented';
  }
}
