const validator = require('../helpers/validator');

const { Errors } = require('../helpers/error');

module.exports = (schema) => (req, res, next) => {
  try {
    const body = req.body;

    const { error } = validator.validate(body, schema);

    if (error) {
      throw Errors.validatorError(error);
    }

    next();
  } catch (err) {
    next(err);
  }
};
