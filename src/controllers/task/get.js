const moment = require('moment');

const sortBy = require('../../helpers/sort-by');
const { parallel } = require('../../helpers/async');
const pagination = require('../../helpers/pagination');

const ALLOWED_SORT_BY = ['title', 'dueDate', 'priority'];

module.exports = async ({ db, userId, query }) => {
  const { order, orderBy } = sortBy(ALLOWED_SORT_BY)(query);
  const { page, limit, skip } = pagination.opts(query || {});

  const [total, tasks] = await parallel([
    db.collections.tasks.count({ userId }),
    db.collections.tasks.aggregate([
      {
        $match: { userId },
      },
      {
        $sort: { [orderBy]: order },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id     : 1,
          title   : 1,
          dueDate : 1,
          priority: 1,
        },
      },
    ]).toArray(),
  ]);

  // eslint-disable-next-line
  tasks.forEach(task => task.dueDate = +moment(task.dueDate).format('x'));

  return {
    status: 200,
    data  : {
      data: tasks,
      meta: {
        page,
        limit,
        total,
        pages: pagination.pages(limit, total),
      },
    },
  };
};
