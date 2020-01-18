const http = require('http');

const App = require('./app');
const dbManager = require('./db');

const logger = require('./helpers/logger');

const { ErrorHandlers } = require('./helpers/error');

const config = require('./config');

process.on('unhandledRejection', ErrorHandlers.unhandledRejection);
process.on('uncaughtException', ErrorHandlers.uncaughtException);

(async () => {
  const client = await dbManager.createConnection(config.MONGO_DB_URL);

  await dbManager.initCollections(config.MONGO_DB_URL, config.MONGO_DB_NAME);

  client.on('error', (err) => {
    logger.error(err);
    process.exit(1);
  });
  client.on('close', () => {
    logger.error('Mongo driver connection disconnected');
    process.exit(1);
  });

  const app = App();
  const httpServer = http.createServer(app);

  httpServer.on('error', ErrorHandlers.httpServerOnErrorHandler);
  httpServer.on('listening', () => logger.info(`http://${config.HOST}:${config.PORT}/`));

  httpServer.listen(config.PORT, config.HOST);
})();
