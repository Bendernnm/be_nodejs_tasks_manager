const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const lodashTemplates = require('lodash-express');

const { REQUEST } = require('./const');

const routes = require('./routes');

module.exports = () => {
  const app = express();

  lodashTemplates(app, 'html');

  app.enable('trust proxy');
  app.disable('x-powered-by');

  app.set('view engine', 'html');

  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json({ limit: '500kb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(logger('dev'));

  app.use((req, res, next) => {
    req[REQUEST.DATA] = {
      _req   : req,
      headers: req.headers,
      params : req.params,
      query  : req.query,
      body   : req.body,
    };

    next();
  });

  app.use(routes);

  return app;
};
