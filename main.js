'use strict';

const Application = require('./lib/application.js');

const application = new Application();

application.on('started', () => {
  application.logger.log('Application loaded');
});

process.on('SIGINT', async () => {
  if (application.finalization) return;
  console.log();
  application.logger.log('Graceful shutdown');
  await application.shutdown();
  application.logger.log('Bye');
  process.exit(0);
});

const logError = err => {
  application.logger.error(err.stack);
};

process.on('uncaughtException', logError);
process.on('warning', logError);
process.on('unhandledRejection', logError);
