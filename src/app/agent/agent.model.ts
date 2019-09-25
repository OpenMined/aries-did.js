import { Connection } from './modules/connection/connection.model';

export class Agent {
  connection: Connection;
  constructor(connection: Connection) {
    this.connection = connection;
  }
}
