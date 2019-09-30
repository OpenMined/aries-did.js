import { Connection } from '../../agent/modules/connection/connection.model';
import {
  IConnectionParams,
  IConnectionsResult
} from '../../core/interfaces/connection.interface';
import { IRelationshipResponse } from './relationships.interface';
import AgentConfig from '../../config';

export class RelationshipService {
  _connections: Connection;
  constructor(apiUrl: string) {
    this._connections = new Connection(apiUrl);
  }

  mapRelationships(itm: IConnectionsResult): IRelationshipResponse {
    return {
      state: itm.state,
      initiator: itm.initiator,
      name: itm.their_label,
      did: itm.their_did,
      _id: itm.connection_id
    };
  }

  async getRelationships(params: IConnectionParams, id?: string) {
    const res = id
      ? await this._connections.getConnections(params, id)
      : await this._connections.getConnections(params);
    // console.log('relationships', res);
    if (Array.isArray(res)) {
      let relationships = res.map(itm => this.mapRelationships(itm));
      return relationships;
    }

    return res;
  }
}
