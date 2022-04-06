import log4js from 'log4js';

log4js.configure({
  appenders: {
    out: { type: 'stdout'},
    app: { type: 'file', filename: 'application.log' }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: 'debug' }
  }
});

export const logger = log4js.getLogger();

// logger.debug("Some debug messages");
// logger.info("Some debug messages");
// logger.warn("Some debug messages");
// logger.error("Some debug messages");
// logger.fatal("Some debug messages");
