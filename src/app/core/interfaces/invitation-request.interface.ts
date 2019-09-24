export interface IInvitation {
  '@type': string;
  '@id': string;
  recipientKeys: string[];
  label: string;
  serviceEndpoint: string;
}

export interface IInvitationRequestResponse {
  connection_id: string;
  invitation: IInvitation;
  invitation_url: string;
}

export interface IInvitationRequest {
  '@type': string;
  '@id': string;
  serviceEndpoint: string;
  label: string;
  recipientKeys: string[];
}

export interface IConnection {
  connection_id: string;
  updated_at: string;
  request_id: string;
  initiator: string;
  accept: string;
  invitation_key: string;
  routing_state: string;
  my_did: string;
  created_at: string;
  their_label: string;
  state: string;
  invitation_mode: string;
  activity: IConnectionActivity[];
}

export interface IConnectionActivity {
  id: string;
  meta: string;
  time: string;
  type: string;
  direction: string;
  connection_id: string;
}
