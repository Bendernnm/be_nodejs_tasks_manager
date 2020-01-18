const _ = require('lodash');
const mongodb = require('mongodb');

const collectionsInfoAll = require('./collections');

const logger = require('../helpers/logger');
const { each } = require('../helpers/async');

const { DB } = require('../const');

const connectionDefaultOpts = Object.freeze({
  poolSize          : 50,
  wtimeout          : 5000,
  useNewUrlParser   : true,
  useUnifiedTopology: true,
  w                 : 'majority',
});

class DbManager {
  constructor() {
    this.connections = new Map();
  }

  getClient(name) {
    return this.connections.get(name);
  }

  async createConnection(url, opts = connectionDefaultOpts, name = url) {
    try {
      const client = new mongodb.MongoClient(url, opts);

      await client.connect();

      this.connections.set(name, client);

      client[DB.DBS] = {};

      return client;
    } catch (err) {
      logger.error(err.message, err);

      throw err;
    }
  }

  initDb(clientNameOrClient, dbName) {
    const client = typeof clientNameOrClient === 'string' ? this.connections.get(clientNameOrClient) : clientNameOrClient;
    const db = client.db(dbName);

    if (!client[DB.DBS][dbName]) {
      client[DB.DBS][dbName] = { dbName, db, collections: {} };
    }

    return client[DB.DBS][dbName];
  }

  getDb(clientName, dbName) {
    const client = this.connections.get(clientName);

    return client[DB.DBS][dbName] || this.initDb(client, dbName);
  }

  initCollections(clientName, dbName, collectionsNamesList = '*') {
    let collectionsInfoSelected;
    const { db, collections } = this.getDb(clientName, dbName);

    if (collectionsNamesList === '*') {
      collectionsInfoSelected = collectionsInfoAll;
    } else {
      collectionsInfoSelected = _.pick(collectionsInfoAll, collectionsNamesList);
    }

    const collectionsInfo = Object.values(collectionsInfoSelected);

    return each(collectionsInfo, async (collectionInfo) => {
      const collection = await db.createCollection(collectionInfo.name, collectionInfo.opts);

      await db.command({
        collMod  : collectionInfo.name,
        validator: collectionInfo.validator,
      });

      if (typeof collectionInfo.init === 'function') {
        await collectionInfo.init(db, collection);
      }

      collections[collectionInfo.name] = collection;
    });
  }
}

module.exports = new DbManager();
