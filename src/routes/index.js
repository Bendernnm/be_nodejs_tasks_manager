const express = require('express');

const { attachDb } = require('../middlewares');

const { Errors, ErrorHandlers, ERROR_CODES } = require('../helpers/error');

const router = express.Router();

router.use(attachDb);

router.get('/', async (req, res) => res.status(200).send({ message: 'API ash 2.o' }));

router.get('/view', (req, res) => res.status(200).render('index', { hash: 'd34c38d842c' }));

router.use((req, res, next) => {
  next(Errors.notFound({
    message: `NotFound: ${req.originalUrl}`,
    code   : ERROR_CODES.INCORRECT_ROUTE,
  }));
});

router.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const error = ErrorHandlers.expressErrorHandler(err);

  res.status(error.status).send(error);
});

module.exports = router;
