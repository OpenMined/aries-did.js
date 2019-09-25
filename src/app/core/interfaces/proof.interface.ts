export interface IProofRecord {
  auto_present: true;
  thread_id: string;
  connection_id: string;
  presentation_request: {};
  created_at: string;
  updated_at: string;
  presentation: {};
  presentation_proposal_dict: {};
  verified: string;
  state: string;
  error_msg: string;
  initiator: string;
  presentation_exchange_id: string;
}

export interface IProofRecordsResponse {
  result: IProofRecord[];
}

export interface IRestrictions {}
// TODO: expand this to be generics on requestedAttributes, requested_predicates;

export interface IProofProposalRequestResponseSend {
  name: string;
  version: string;
  requestedAttributes: any;
  nonce: string;
  requested_predicates: any;
  connection_id: string;
}

export interface IProofRequestedAttributes {}

export interface IProofProposalRequestResponse {
  auto_present: boolean;
  thread_id: string;
  connection_id: string;
  presentation_request: {};
  created_at: string;
  updated_at: string;
  presentation: {};
  presentation_proposal_dict: {};
  verified: string;
  state: string;
  error_msg: string;
  initiator: string;
  presentation_exchange_id: string;
}

export interface IProposalAttributes {
  name: string;
  cred_def_id: string;
  'mime-type': string;
  value: string;
}

export interface IProposalPredicates {
  name: string;
  cred_def_id: string;
  predicate: string;
  threshold: number;
}

export interface IProposalSend {
  presentation_proposal: {
    '@type': string;
    attributes: IProposalAttributes[];
    predicates: IProposalPredicates;
  };
  auto_present: boolean;
  comment: string;
  connection_id: string;
}
