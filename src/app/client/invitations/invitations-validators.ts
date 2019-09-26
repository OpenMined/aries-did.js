import { IInvitation } from '../../core/interfaces/invitation-request.interface';

export const invitationValid = (invite: IInvitation) => {
  const inviteKeys = ['connection_id', 'invitation', 'invitation_url'];
  const invitationKeys = [
    '@type',
    '@id',
    'recipientKeys',
    'label',
    'serviceEndpoint'
  ];
  console.log(Object.keys(invite));
};
