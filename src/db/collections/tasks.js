const { DB } = require('../../const');

module.exports = {
  name     : DB.COLLECTION.TASKS,
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
        'title',
        'dueDate',
        'priority',
      ],
      properties          : {
        _id      : {
          bsonType: 'objectId',
        },
        userId   : {
          bsonType: 'objectId',
        },
        title    : {
          bsonType: 'string',
        },
        priority : {
          bsonType: 'number',
          minimum : 0,
          maximum : 2,
        },
        dueDate  : {
          bsonType: 'date',
        },
        createdAt: {
          bsonType: 'date',
        },
        updatedAt: {
          bsonType: 'date',
        },
      },
    },
  },
  init     : async (db, collection) => collection.createIndex({ email: 1 }),
};
