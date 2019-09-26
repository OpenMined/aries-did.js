import { IInvitation } from '../../core/interfaces/invitation-request.interface';

/*
{
  connection_id: '19e8c0f5-e395-4071-acd9-7587308a7661',
  invitation: {
    '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
    '@id': 'f4240ddb-b0da-42e1-9ec2-9d9c10f30964',
    recipientKeys: [ 'GP2yGGM86o2BpwuAyrAackfG7tQ68QRcmQpFtcL7pSr5' ],
    label: 'Aries Cloud Agent',
    serviceEndpoint: 'http://192.168.65.3:8050'
  },
  invitation_url: 'http://192.168.65.3:8050?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiZjQyNDBkZGItYjBkYS00MmUxLTllYzItOWQ5YzEwZjMwOTY0IiwgInJlY2lwaWVudEtleXMiOiBbIkdQMnlHR004Nm8yQnB3dUF5ckFhY2tmRzd0UTY4UVJjbVFwRnRjTDdwU3I1Il0sICJsYWJlbCI6ICJBcmllcyBDbG91ZCBBZ2VudCIsICJzZXJ2aWNlRW5kcG9pbnQiOiAiaHR0cDovLzE5Mi4xNjguNjUuMzo4MDUwIn0='
}
*/

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
