export interface IInvitation {
  '@type': string;
  '@id': string;
  recipientKeys: string[];
  label: string;
}

export interface IInvitationRequestResponse {
  connection_id: string;
  invitation: IInvitation;
  invitation_url: string;
}
