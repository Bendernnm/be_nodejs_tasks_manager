const { REQUEST } = require('../../const');

const wrapper = (fn) => (req, res, next) => {
  try {
    return fn(req[REQUEST.DATA]);
  } catch (err) {
    next(err);
  }
};

module.exports = (controller) => {
  const routes = {};

  Object.keys(controller).forEach((key) => {
    if (typeof controller[key] === 'function') {
      routes[key] = wrapper(controller[key]);
    }
  });

  return routes;
};
