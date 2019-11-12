import * as PouchDB from 'pouchdb';

import * as pouchdbfind from 'pouchdb-find';

PouchDB.plugin(pouchdbfind);

export interface ICredDefStore {
  _id: string;
  name: string;
  version: string;
  attributes: string;
  schema_id: string;
}

export type DBPrefixType = 'cdef';

export interface IDBGetOptions {
  prefix?: DBPrefixType;
  include_docs?: boolean;
  all?: boolean;
  _id?: string;
}

export interface IBaseDBRecord {
  _id: string;
}

export interface ICredDef extends IBaseDBRecord {
  name: string;
  version: string;
  attributes: string[];
  schema_id: string;
  _rev?: string;
}

export type DBRecordType = ICredDef;

export interface IDBInsertOptions {
  prefix: DBPrefixType;
  record: DBRecordType;
}

class DataStore {
  _db: PouchDB.Database;

  constructor(options: { url?: string; name?: string }) {
    let { url = 'http://localhost:5984/', name = 'data' } = options;
    this._db = new PouchDB(url + name);
  }

  async cleanDatabase() {
    return await this._db.destroy();
  }
  /*
  Array<{
    doc?: ExistingDocument<Content & AllDocsMeta>;
    id: DocumentId;
    key: DocumentKey;
    value: {
        rev: RevisionId;
        deleted?: boolean;
    }
}>
*/
  async getRecords(opts: IDBGetOptions) {
    let { prefix, include_docs = true, all, _id } = opts;
    try {
      const query = this._db.allDocs({
        include_docs: include_docs,
        startkey: prefix || undefined,
        endkey: prefix + '\ufff0'
      });

      let res = await query;

      let results = include_docs ? res.rows.map(itm => itm.doc) : res;
      return results;
    } catch (err) {
      throw new Error(err);
    }
  }

  async syncRecords(opts: {
    prefix: DBPrefixType;
    func: (id: string) => Promise<boolean>;
  }) {
    let { prefix, func } = opts;

    let results = (await this.getRecords({ prefix })) as any[];

    results.forEach(async itm => {
      let { _id: id } = itm as { _id: string };

      let sliced = id.slice(id.indexOf('_') + 1, id.length + 1);
      try {
        let hasRecord = await func(sliced);
        // console.log('resolved value', hasRecord);
        // console.log(itm);
        if (!hasRecord) await this._db.remove(itm);
      } catch {
        await this._db.remove(itm);
      }
    });
  }

  async insertRecord(opts: IDBInsertOptions) {
    let { prefix, record } = opts;
    record._id = `${prefix}_${record._id}`;
    try {
      let { _rev } = await this._db.get(record._id, {});
      record._rev = _rev;
      return await this._db.put(record);
    } catch {
      return await this._db.put(record);
    }
  }

  async putCredDef(record: ICredDefStore) {
    const storeRecord = { _id: `cdef_${record._id}` };
    return await this._db.put(storeRecord);
  }

  async getRecord(opts: { _id: string }) {
    let { _id } = opts;
    try {
      return await this._db.get(_id);
    } catch (err) {
      throw new Error(err);
    }
  }

  async removeRecord(opts: { _id: string }) {
    let { _id } = opts;
    try {
      const doc = await this.getRecord({ _id });
      console.log(doc);
      return await this._db.remove(doc);
    } catch (err) {
      throw new Error(err);
    }
  }
}

/*
const doc = {
  _id: uuid(),
  name: 'test1'
};
*/

const dataStore = new DataStore({});

export default dataStore;
