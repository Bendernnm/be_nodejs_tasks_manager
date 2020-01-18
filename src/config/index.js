require('dotenv').config({ path: `${__dirname}/.env` });

const ENV = process.env;
const NODE_ENV = ENV.NODE_ENV;

const REQUIRED_CONFIG = ['NODE_ENV'];

REQUIRED_CONFIG.forEach((field) => {
  if (!ENV.hasOwnProperty(field)) {
    throw new Error('Missing required config!');
  }
});

module.exports = {
  NODE_ENV,

  HOST: ENV.HOST || '127.0.0.1',
  PORT: ENV.PORT ? +ENV.PORT : 4040,
};
