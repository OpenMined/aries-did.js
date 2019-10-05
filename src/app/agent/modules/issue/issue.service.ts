import { IIssueSend } from 'src/app/core/interfaces/issue-credential.interface';

/*
{
  "credential_proposal": {
    "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
    "attributes": [
      {
        "name": "favourite_drink",
        "mime-type": "image/jpeg",
        "value": "martini"
      }
    ]
  },
  "credential_definition_id": "WgWxqztrNooG92RXvxSTWv:3:CL:20:tag",
  "comment": "string",
  "connection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

*/

/*
  definition for the format of a sent credential;
*/

export class IssueService {
  private _url: string;

  constructor(url: string) {
    this._url = url;
  }

  issueCredentialSend(cred: IIssueSend) {}
}
