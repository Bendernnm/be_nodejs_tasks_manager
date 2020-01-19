const mongodb = require('mongodb');

const { Errors, ERROR_MESSAGE } = require('../helpers/error');

module.exports = (...parameters) => (req, res, next) => {
  try {
    const params = req.params;

    parameters.forEach((parameter) => {
      if (!params.hasOwnProperty(parameter)
          || !mongodb.ObjectId.isValid(params[parameter])) {
        throw Errors.notValidParameter({
          target : parameter,
          message: ERROR_MESSAGE.INVALID_PARAMETER,
        });
      }
    });

    next();
  } catch (err) {
    next(err);
  }
};
