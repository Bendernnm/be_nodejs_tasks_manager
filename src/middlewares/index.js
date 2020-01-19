const validate = require('./validate');
const attachDb = require('./attach-db');
const authorization = require('./authorization');
const isValidParamsId = require('./is-valid-params-id');

module.exports = { attachDb, validate, authorization, isValidParamsId };
