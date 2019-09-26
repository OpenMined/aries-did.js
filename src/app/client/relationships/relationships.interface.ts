import {
  ConnectionState,
  ConnectionInitiator
} from '../../core/interfaces/connection.interface';

export interface IRelationshipResponse {
  state: ConnectionState;
  initiator: ConnectionInitiator;
  name: string;
  did: string;
  _id: string;
}
