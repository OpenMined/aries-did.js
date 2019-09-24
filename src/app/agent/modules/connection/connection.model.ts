import { ConnectionService } from './connection.service';
import {
  ConnectionState,
  IConnectionsResult
} from '../../../core/interfaces/connection.interface';

export class Connection {
  private connectionSvc = new ConnectionService();
  constructor() {}

  async filterConnectionsByState(state?: ConnectionState) {
    try {
      const res = await this.connectionSvc.connections();
      return state
        ? res.filter((itm: IConnectionsResult) => itm.state === state)
        : res;
    } catch (err) {
      throw err.message;
    }
  }
}
