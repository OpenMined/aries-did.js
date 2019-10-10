import { ProofService } from './proof.service';
import {
  IProposalSend,
  IProofRequest,
  ProofAttributeType
} from 'src/app/core/interfaces/proof.interface';
import { Schema } from '../schema/schema.model';
import { CredentialDefinition } from '../credential-definition/credential-definition.model';
import { ISchema } from 'src/app/core/interfaces/schema.interface';

/*
  the chain for creating proof requests requires an established relationships
  and a credential.

  the chain typically goes

  send proof presentiation request free of any presentation (no presexid) then verify the received presentation> 

  build the 

*/

export class Proof {
  private _schema: Schema;
  private _credDef: CredentialDefinition;
  private _proofSvc: ProofService;

  /*
    unimplemented methods
  */

  sendPresentation() {
    return 'method not implemented';
  }

  sendProposal() {
    return 'method not implemented';
  }

  constructor(apiUrl: string, schema: Schema, credDef: CredentialDefinition) {
    this._schema = schema;
    this._credDef = credDef;
    this._proofSvc = new ProofService(apiUrl);
  }

  async records(id?: string) {
    return await this._proofSvc.getProofRecords();
  }

  /*
    build a proof request values for a new proof request
  */

  async buildProofRequest<T>(
    schema: ISchema,
    connection_id: string,
    name: string
  ): Promise<any> {
    const schemaResponse = await this._schema.createSchema(schema);
    const credDef = await this._credDef.createCredentialDefinition(
      schemaResponse.schema_id
    );
    const data = {
      name,
      restrictions: {
        schema_name: schema.schema_name,
        schema_version: schema.schema_version,
        credential_definition_id: credDef.credential_definition_id
      }
    };
    /*
    function asProofAttribute<T>(
      data: ProofAttributeType<T>
    ): ProofAttributeType<T> {
      return data;
    }
*/
    const proofRequest = {
      version: '1.0',
      connection_id,
      proof_request: {
        requested_attributes: {
          prop1: data
        },
        requested_predicates: {},
        name
      }
    };
    return proofRequest;
  }

  /*
    send a proof request free from proposal or
    include an ID to send in response to a proposal.
  */

  async sendProofRequest(proofRequest: IProofRequest<any>, presExId?: string) {
    // const res = presExId ? await this._proofSvc.postProof(proofRequest, 'send-presentation', presExId) :
    try {
      const res = await this._proofSvc.postProof(proofRequest);
      // console.log(res);
      if (!res) throw new Error('no proof request made');
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /*
    send a verification of the proof request received from the foreign agent
  */

  async verifyProofRequest() // id: string
  {
    return;
  }
  async removeAllProofRequests() {
    const requests = await this._proofSvc.getProofRecords();
    if (Array.isArray(requests)) {
      for (const request of requests) {
        await this._proofSvc.remove(request.presentation_exchange_id);
      }
    }
  }
}
