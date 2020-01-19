const moment = require('moment');

const { Errors } = require('../../helpers/error');

module.exports = async ({ db, body, now, userId }) => {
  const { title, dueDate, priority } = body;

  const dueDateMoment = moment(dueDate);

  if (!dueDateMoment.isValid() || dueDateMoment.valueOf() <= now) {
    throw Errors.notValidParameter({ targer: 'dueDate', message: 'Incorrect parameter' });
  }

  await db.collections.tasks.insertOne({
    userId,
    title,
    priority,
    createdAt: now,
    updatedAt: now,
    dueDate  : dueDateMoment.toDate(),
  });

  return { status: 201, data: { message: 'Success created task' } };
};
