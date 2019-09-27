import { ConnectionService } from './connection.service';
import {
  ConnectionState,
  IConnectionsResult,
  IConnectionParams
} from '../../../core/interfaces/connection.interface';
import {
  IInvitation,
  IInvitationRequestResponse
} from '../../../core/interfaces/invitation-request.interface';

export class Connection {
  private connectionSvc: ConnectionService;

  formatInvitation(body: IInvitationRequestResponse) {
    const invitation = {
      '@type': body.invitation['@type'],
      '@id': body.invitation['@id'],
      serviceEndpoint: body.invitation.serviceEndpoint,
      label: 'Node Controller',
      recipientKeys: body.invitation.recipientKeys
    };
    return invitation;
  }

  constructor(apiUrl: string) {
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

  async filterConnectionsByState(state?: ConnectionState) {
    // try {
    //   const res = await this.connectionSvc.connections();
    //   if (Array.isArray) {
    //   return state
    //     ? res.filter((itm: IConnectionsResult) => itm.state === state)
    //     : res;
    //   }
    // } catch (err) {
    //   return err;
    // }
  }

  /*
    respond to an invitation. 
    Setting autoAccept to true will automatically accept the invitation
    You can optionally choose to reject it by setting accept to be false.
  */

  async invitationResponse(
    invitation: IInvitation,
    autoAccept: boolean = true,
    accept?: boolean
  ) {
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
}
