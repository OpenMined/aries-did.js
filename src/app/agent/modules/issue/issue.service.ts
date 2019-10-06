import { IIssueSend } from 'src/app/core/interfaces/issue-credential.interface';
import * as request from 'superagent';
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
  private _segment: string = 'issue-credential/';

  constructor(url: string) {
    this._url = url;
  }

  async issueCredentialSend(cred: IIssueSend) {
    try {
      console.log('the credential to send', JSON.stringify(cred, null, 2));
      return await request.post(`${this._url}${this._segment}send`).send(cred);
    } catch (err) {
      return err;
    }
  }
}
