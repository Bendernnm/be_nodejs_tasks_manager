const mongodb = require('mongodb');

module.exports = async ({ db, params, userId }) => {
  const taskId = new mongodb.ObjectId(params.taskId);

  await db.collections.tasks.deleteOne({ userId, _id: taskId });

  return { status: 200, data: { message: 'Success deleted task' } };
};
