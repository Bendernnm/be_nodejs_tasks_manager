const Joi = require('@hapi/joi');

module.exports = Joi.object().keys({
  title   : Joi.string(),
  dueDate : Joi.number().integer().min(0),
  priority: Joi.number().integer().min(0).max(2),
}).strict();
