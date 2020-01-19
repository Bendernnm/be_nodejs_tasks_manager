const moment = require('moment');
const mongodb = require('mongodb');

const { Errors, ERROR_CODES } = require('../../helpers/error');

module.exports = async (req) => {
  const { db, body, now, params } = req;
  const { title, dueDate, priority } = body;
  const taskId = new mongodb.ObjectId(params.taskId);

  const oldTask = await db.collections.tasks.findOne({ _id: taskId });

  if (oldTask) {
    throw Errors.notFound({ code: ERROR_CODES.OBJECT_NOT_FOUND, target: 'task' });
  }

  const update = {};
  const { title: oldTitle, dueDate: oldDueDate, priority: oldPriority } = oldTask;

  if (title && title !== oldTitle) {
    update.title = title;
  }

  if (priority && priority !== oldPriority) {
    update.priority = priority;
  }

  const oldDueDateInt = +moment(oldDueDate).format('x');

  if (dueDate && dueDate !== oldDueDateInt) {
    const dueDateMoment = moment(dueDate);

    if (!dueDateMoment.isValid() || dueDateMoment.valueOf() <= now) {
      throw Errors.notValidParameter({ targer: 'dueDate', message: 'Incorrect parameter' });
    }

    update.dueDate = dueDateMoment.toDate();
  }

  if (Object.keys(update).length) {
    await db.collections.tasks.updateOne({ _id: taskId }, { $set: update });
  }

  return {
    status: 200,
    data  : { message: 'Success edited task' },
  };
};
