import { IConnection, IBasicMessage } from '../core/interfaces/agent.interface';

import * as request from 'superagent';
import {
  IInvitationRequestResponse,
  IInvitationRequest
} from '../core/interfaces/invitation-request.interface';
import { Schema } from './modules/schema/schema.model';
import { ISchema } from '../core/interfaces/schema.interface';
import { CredentialDefinition } from './modules/credential-definition/credential-definition.model';
import { Connection } from './modules/connection/connection.model';

/*
  Agent service runs all the models and services together to
  create a sub-agent process for communicating with the AcaPy
  agent.
*/

const apiUrl = 'http://localhost:8051/';

export class AgentService {
  private _schema: Schema;
  private _credDef: CredentialDefinition;
  private _connection: Connection;

  connectionId: string;

  constructor(connection: Connection, schema?: Schema) {
    this._connection = connection;
    // this._schema = schema || new Schema();
    // this._credDef = new CredentialDefinition(this._schema);
  }

  detectConnection() {}

  async connectionReady() {}

  async handleConnections(message: IConnection) {
    console.log('message');
    if (
      message.connectionId === this.connectionId &&
      message.state === 'active'
    ) {
      return console.log('Connected');
    }
  }

  handleIssueCredentials() {}

  handlePresentProof() {}

  handleBasicMessages(mssg: IBasicMessage) {
    console.log('Received message ', mssg.content);
  }

  createCredentialDefinition(schema: ISchema) {}
}
