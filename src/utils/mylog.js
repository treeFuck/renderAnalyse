/**
 * @description 打日志，日志输入到 application.log
 * @author bolewang
 * @date 2022-04-07
 */

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

const logger = log4js.getLogger();
export default logger;

// logger.debug("Some debug messages");
// logger.info("Some debug messages");
// logger.warn("Some debug messages");
// logger.error("Some debug messages");
// logger.fatal("Some debug messages");
