import { Connection } from '../../agent/modules/connection/connection.model';

export class RelationshipService {
  private _connections = new Connection();
  constructor() {}

  async getRelationships(id?: string) {
    const res = id
      ? await this._connections.getConnections(id)
      : await this._connections.getConnections();
    console.log('relationships', res);
    if (Array.isArray(res)) {
      let relationships = res
        .filter(itm => itm.state === 'active')
        .map(itm => ({}));
      console.log(relationships);
      return relationships;
    }
    const result = {};
    return res;
  }

  async createInvitation() {
    try {
      const res = await this._connections.createInvitation();
      return res;
    } catch (err) {
      return err;
    }
  }
}
