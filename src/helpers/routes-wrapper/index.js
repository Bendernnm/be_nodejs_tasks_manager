const { REQUEST } = require('../../const');

const wrapper = (fn) => async (req, res, next) => {
  try {
    // update params
    req[REQUEST.DATA].params = { ...(req[REQUEST.DATA].params || {}), ...req.params };

    const { status, data } = await fn(req[REQUEST.DATA]);

    res.status(status).json(data);
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
