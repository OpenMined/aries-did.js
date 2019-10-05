export interface ICredentialRecord {
  credential_proposal_dict: any;
  state: string;
  credential_request: any;
  updated_at: string;
  raw_credential: any;
  credential: any;
  initiator: string;
  credential_definition_id: string;
  credential_request_metadata: any;
  schema_id: string;
  credential_offer: any;
  auto_offer: boolean;
  credential_id: string;
  error_msg: string;
  parent_thread_id: string;
  created_at: string;
  thread_id: string;
  credential_exchange_id: string;
  connection_id: string;
  auto_issue: boolean;
}

export interface IRecordsResult {
  thread_id: string;
  created_at: string;
  updated_at: string;
  error_msg: string;
  state: string;
  initiator: string;
  credential_proposal_dict: {};
  credential_id: string;
  raw_credential: {};
  auto_offer: true;
  connection_id: string;
  credential_definition_id: string;
  credential_offer: {};
  auto_issue: true;
  credential_request: {};
  credential: {};
  schema_id: string;
  parent_thread_id: string;
  credential_exchange_id: string;
  credential_request_metadata: {};
}

export interface ICredentialAttributes {
  name: string;
  'mime-type'?: string;
  value: string;
}

export interface ICredentialProposal {
  '@type': string;
  attributes: ICredentialAttributes[];
}

export interface IIssueSend {
  credential_proposal: ICredentialProposal;
  credential_definition_id: {
    credential_definition_id: string;
  };
  comment: string;
  connection_id: string;
}

export interface ICredentialSendResponse {
  credential_proposal_dict: any;
  state: string;
  credential_request: any;
  updated_at: string;
  raw_credential: any;
  credential: any;
  initiator: string;
  credential_definition_id: string;
  credential_request_metadata: any;
  schema_id: string;
  credential_offer: any;
  auto_offer: boolean;
  credential_id: string;
  error_msg: string;
  parent_thread_id: string;
  created_at: string;
  thread_id: string;
  credential_exchange_id: string;
  connection_id: string;
  auto_issue: boolean;
}

export interface ICredentialSendProposalResponse {
  credential_proposal_dict: any;
  state: string;
  credential_request: any;
  updated_at: string;
  raw_credential: any;
  credential: any;
  initiator: string;
  credential_definition_id: string;
  credential_request_metadata: any;
  schema_id: string;
  credential_offer: any;
  auto_offer: true;
  credential_id: string;
  error_msg: string;
  parent_thread_id: string;
  created_at: string;
  thread_id: string;
  credential_exchange_id: string;
  connection_id: string;
  auto_issue: true;
}

export interface ICredExRecordResponse {
  credential: any;
  credential_offer: any;
  parent_thread_id: string;
  credential_id: string;
  credential_proposal_dict: any;
  created_at: string;
  connection_id: string;
  updated_at: string;
  credential_request: any;
  credential_request_metadata: any;
  auto_issue: boolean;
  thread_id: string;
  raw_credential: any;
  schema_id: string;
  auto_offer: boolean;
  error_msg: string;
  initiator: string;
  credential_definition_id: string;
  credential_exchange_id: string;
  state: string;
}
