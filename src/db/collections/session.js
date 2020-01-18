const { DB } = require('../../const');

module.exports = {
  name     : DB.COLLECTION.SESSION,
  opts     : {
    wtimeout: 5000,
    w       : 'majority',
  },
  validator: {
    $jsonSchema: {
      additionalProperties: false,
      bsonType            : 'object',
      required            : [
        '_id',
        'userId',
        'authorizationToken',
        'refreshToken',
        'deviceId',
        'createdAt',
        'updatedAt',
      ],
      properties          : {
        _id               : { bsonType: 'objectId' },
        userId            : { bsonType: 'objectId' },
        authorizationToken: { bsonType: 'string' },
        refreshToken      : { bsonType: 'string' },
        deviceId          : { bsonType: 'string' },
        createdAt         : { bsonType: 'date' },
        updatedAt         : { bsonType: 'date' },
      },
    },
  },
  init     : async (db, collection) => collection.createIndex({ authorizationToken: 1 }),
};
