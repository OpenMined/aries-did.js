import { IInvitation } from '../../core/interfaces/invitation-request.interface';

export const invitationValid = (invite: IInvitation): boolean => {
  const invitationKeys = [
    '@type',
    '@id',
    'recipientKeys',
    'label',
    'serviceEndpoint'
  ];
  for (const key in invite) {
    if (!invitationKeys.some(itm => key === itm)) return false;
    return true;
  }
  return true;
};
