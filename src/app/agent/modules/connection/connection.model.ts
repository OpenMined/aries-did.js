import { ConnectionService } from './connection.service';
import {
  IConnectionsResult,
  IConnectionParams
} from '../../../core/interfaces/connection.interface';
import {
  IInvitation,
  IInvitationRequestResponse,
  IReceiveInvitationRequestResponse,
  IAcceptApplicationRequestResponse
} from '../../../core/interfaces/invitation-request.interface';

export class Connection {
  private connectionSvc: ConnectionService;

  formatInvitation(body: IInvitationRequestResponse) {
    const invitation = {
      '@type': body.invitation['@type'],
      '@id': body.invitation['@id'],
      serviceEndpoint: body.invitation.serviceEndpoint,
      label: body.invitation.label,
      recipientKeys: body.invitation.recipientKeys
    };
    return invitation;
  }

  constructor(apiUrl: string) {
    console.log('test agent url', apiUrl);
    this.connectionSvc = new ConnectionService(apiUrl);
  }

  /*
    Get all connections or enter an id to get a specific connection
  */
  async getConnections(
    params: IConnectionParams = {},
    id?: string | null
  ): Promise<IConnectionsResult | IConnectionsResult[]> {
    try {
      const res = id
        ? await this.connectionSvc.connections(id, params)
        : await this.connectionSvc.connections(null, params);
      return res;
    } catch (err) {
      return err;
    }
  }

  async createInvitation(): Promise<IInvitation> {
    try {
      const res = await this.connectionSvc.createInvitation();
      return this.formatInvitation(res);
    } catch (err) {
      return err;
    }
  }

  /*
    respond to an invitation. 
    Setting autoAccept to true ** deprecated ** will automatically accept the invitation
    You can optionally choose to reject it by setting accept to be false.
  */

  async invitationResponse(
    invitation: IInvitation,
    autoAccept: boolean = true,
    accept?: boolean
  ): Promise<IReceiveInvitationRequestResponse> {
    try {
      const res = await this.connectionSvc.receiveInvitation(
        invitation,
        autoAccept
      );
      return res;
    } catch (err) {
      console.log('invitation response failed');
      return err;
    }
  }

  async acceptInvitation(
    id: string,
    accept = true
  ): Promise<IAcceptApplicationRequestResponse> {
    try {
      const res = await this.connectionSvc.acceptInvitation(id);
      return res;
    } catch (err) {
      return err;
    }
  }

  async requestResponse(id: string, accept = true) {
    if (accept) {
      try {
        let res = await this.connectionSvc.acceptRequest(id);
        return res;
      } catch (err) {
        return err;
      }
    }
    try {
      let res = await this.connectionSvc.sendRemoveConnection(id);
      return 'removed';
    } catch (err) {
      return err;
    }
  }
  async removeAllConnections() {
    try {
      let connections = await this.connectionSvc.connections();
      if (Array.isArray(connections)) {
        for (let connection of connections) {
          let res = await this.removeConnection(connection.connection_id);
        }
      }
    } catch (err) {
      return err;
    }
  }

  async removeConnection(id: string) {
    try {
      const res = await this.connectionSvc.sendRemoveConnection(id);
      return res;
    } catch (err) {
      return err;
    }
  }
}
