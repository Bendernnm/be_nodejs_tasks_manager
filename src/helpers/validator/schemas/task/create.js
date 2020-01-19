const Joi = require('@hapi/joi');

module.exports = Joi.object().keys({
  title   : Joi.string().required(),
  dueDate : Joi.number().integer().required().min(0),
  priority: Joi.number().integer().required().min(0).max(2),
}).strict();
