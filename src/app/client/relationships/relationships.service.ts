import { Connection } from '../../agent/modules/connection/connection.model';
import {
  IConnectionParams,
  IConnectionsResult
} from '../../core/interfaces/connection.interface';
import { IRelationshipResponse } from './relationships.interface';

export class RelationshipService {
  private _connections = new Connection();
  constructor() {}

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
      console.log(relationships);
      return relationships;
    }

    return res;
  }
}
