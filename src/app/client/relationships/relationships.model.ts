import { Connection } from '../../agent/modules/connection/connection.model';

export class Relationships {
  private _connections = new Connection();
  constructor() {}

  async getRelationships(id?: string) {
    const res = id
      ? await this._connections.getConnections(id)
      : await this._connections.getConnections();
    if (Array.isArray(res)) {
      let relationships = res.map(itm => ({
        theirDid: itm.their_did,
        connectionId: itm.connection_id
      }));
      console.log(relationships);
      return relationships;
    }
  }
}
