const express = require('express');

const task = require('../controllers/task');
const { validate, authorization, isValidParamsId } = require('../middlewares');

const validator = require('../helpers/validator');

const router = express.Router({ mergeParams: true });

router.use(authorization());

router.get('/', task.routes.get);

// todo get by id

router.post('/', validate(validator.schemas.task.create), task.routes.create);

router.put('/:taskId', isValidParamsId('taskId'), validate(validator.schemas.task.edit), task.routes.edit);

router.delete('/:taskId', isValidParamsId('taskId'), task.routes.remove);

module.exports = router;
