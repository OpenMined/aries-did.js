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
