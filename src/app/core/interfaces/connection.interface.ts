export type ConnectionState =
  | 'init'
  | 'invitation'
  | 'request'
  | 'response'
  | 'active'
  | 'error'
  | 'inactive';

export type RoutingState = 'none' | 'request' | 'active' | 'error';

export interface IConnectionsResult {
  my_did: string;
  inbound_connection_id: string;
  created_at: string;
  updated_at: string;
  error_msg: string;
  state: ConnectionState;
  initiator: string;
  request_id: string;
  routing_state: RoutingState;
  connection_id: string;
  their_label: string;
  accept: string;
  their_role: string;
  alias: string;
  invitation_mode: string;
  their_did: string;
  invitation_key: string;
}
