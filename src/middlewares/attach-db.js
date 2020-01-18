const dbManager = require('../db');

const { REQUEST } = require('../const');

const config = require('../config');

module.exports = (req, res, next) => {
  try {
    const { db, dbName, collections } = dbManager.getDb(config.MONGO_DB_URL, config.MONGO_DB_NAME);

    req[REQUEST.DATA].db = { dbName, collections, _db: db };

    next();
  } catch (err) {
    next(err);
  }
};
