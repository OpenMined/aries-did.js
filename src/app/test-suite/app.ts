import main from './init';

import hookController from '../hooks/hook.controller';

import webhookObservable from '../hooks/modules/listeners/webhook.listeners';
import { IConnectionHookResponse } from '../hooks/modules/connections/connections.controller';
import { DataStore, IBaseDBRecord } from '../client/db';

const types = ['connections', 'proofs', 'issues', 'mssgs'];

let ds = new DataStore({ name: 'test', url: 'http://localhost:5984' });
ds._db.destroy();
ds = new DataStore({ name: 'test', url: 'http://localhost:5984' });

hookController.listen(3050, () => {
  console.log('app started on', 3050);
  for (let type of types) {
    hookController.addListener(type, data => {
      console.log(data);
    });
  }

  console.log(hookController.eventNames());
  hookController.on('connections', data => {
    console.log('connections hook', data);
    webhookObservable.setSubject({ dataType: '_connectionSubject', val: data });
  });
  hookController.on('mssgs', data => {
    console.log(' hook', data);
    webhookObservable.setSubject({ dataType: '_mssgSubject', val: data });
  });
  hookController.on('proofs', data => {
    console.log(' hook', data);
    webhookObservable.setSubject({ dataType: '_proofSubject', val: data });
  });
  hookController.on('issues', data => {
    console.log(' hook', data);
    webhookObservable.setSubject({ dataType: '_issueSubject', val: data });
  });
});

const connectionDict = {
  init: (data: IConnectionHookResponse) => {
    return false;
  },
  invitation: (data: IConnectionHookResponse) => {
    return false;
  },
  request: (data: IConnectionHookResponse) => {
    return false;
  },
  response: (data: IConnectionHookResponse) => {
    return false;
  },
  active: (data: IConnectionHookResponse) => {
    return false;
  },
  error: (data: IConnectionHookResponse) => {
    return false;
  },
  inactive: (data: IConnectionHookResponse) => {
    return false;
  }
};

export interface ITestResult extends IBaseDBRecord {
  name: string;
  pass: boolean;
  type: 'connection' | 'issue' | 'mssg' | 'proof';
  comments: string | null;
}

const delay = process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 10000;

const buildTests = (data: any): ITestResult[] => {
  const results: ITestResult[] = [];

  for (const key in connectionDict) {
    results.push({
      name: key,
      pass: false,
      comments: null,
      type: 'connection',
      _id: (results.length + 1).toString(2)
    });
  }
  return results;
};
const connectionResults = buildTests(connectionDict);

setTimeout(() => {
  connectionResults.forEach(itm => {
    ds.insertRecord({ prefix: 'test', record: itm });
  });
}, delay);

webhookObservable.connectionSubject.subscribe(
  (obs: IConnectionHookResponse) => {
    // console.log(obs);
    const func = connectionDict[obs.state](obs);
    const timeout = setTimeout(() => {
      connectionResults.forEach(result => {});
    }, delay);
    let testResult = connectionResults
      .filter(itm => itm.name === obs.state)
      .reduce(val => val);
    let index = connectionResults.indexOf(testResult);
    console.log(index);
    ds.insertRecord({ prefix: 'test', record: testResult });
  }
);

webhookObservable.issueSubject.subscribe(obs => {
  console.log('issue');
});

webhookObservable.proofSubject.subscribe(obs => {
  console.log('proofs');
});

webhookObservable.mssgSubject.subscribe(obs => [console.log('mssgs')]);
