import { Subject } from 'rxjs';

class WebhookListeners {
  private _issueSubject = new Subject<any>();
  private _connectionSubject = new Subject<any>();
  private _proofSubject = new Subject<any>();
  private _mssgSubject = new Subject<any>();

  get issueSubject() {
    return this._issueSubject.asObservable();
  }

  get proofSubject() {
    return this._proofSubject.asObservable();
  }
  get connectionSubject() {
    return this._connectionSubject.asObservable();
  }
  get mssgSubject() {
    return this._mssgSubject.asObservable();
  }

  setSubject(opts: {
    val: any;
    dataType:
      | '_issueSubject'
      | '_connectionSubject'
      | '_proofSubject'
      | '_mssgSubject';
  }) {
    const { dataType, val } = opts;
    return this[dataType].next(val);
  }

  constructor() {}
}

const listeners = new WebhookListeners();

export default listeners;
