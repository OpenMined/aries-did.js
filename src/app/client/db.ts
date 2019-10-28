import * as PouchDB from 'pouchdb';

const db = new PouchDB('alice');

/*
const doc = {
  _id: uuid(),
  name: 'test1'
};
*/

export default db;
