import { Connection } from '../../agent/modules/connection/connection.model';
import { IConnectionParams } from '../../agent/modules/connection/connection.service';
import { IInvitation } from '../../core/interfaces/invitation-request.interface';
import { invitationValid } from './invitations-validators';

export class InvitationService {
  _connection = new Connection();
  constructor() {}
  async createInvitation() {
    try {
      const res = await this._connection.createInvitation();
      return res;
    } catch (err) {
      return err;
    }
  }

  async getInvitations(params?: IConnectionParams) {
    const res = await this._connection.getConnections(null, params);
    // console.log('invitations result', res);
    return res;
  }

  async acceptInvitation(invite: IInvitation) {
    console.log(invitationValid(invite));
    try {
      const res = await this._connection.invitationResponse(invite);
      return res;
    } catch (err) {
      return err;
    }
  }
}
