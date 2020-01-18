const http = require('http');

const App = require('./app');

const logger = require('./helpers/logger');

const { ErrorHandlers } = require('./helpers/error');

const { PORT, HOST } = require('./config');

process.on('unhandledRejection', ErrorHandlers.unhandledRejection);
process.on('uncaughtException', ErrorHandlers.uncaughtException);

const app = App();
const httpServer = http.createServer(app);

httpServer.on('error', ErrorHandlers.httpServerOnErrorHandler);
httpServer.on('listening', () => logger.info(`http://${HOST}:${PORT}/`));

httpServer.listen(PORT, HOST);
