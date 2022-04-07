import { logger } from "./src/utils/index.js";
import { URL } from 'url';
import { cwd } from 'process';

console.log(JSON.stringify({a:1}))

let str = new URL('./dist/a.png', import.meta.url);
console.log(str);
console.log(`Current directory: ${cwd()}`);


logger.debug("Some debug messages");
logger.info("Some debug messages");
logger.warn("Some debug messages");
logger.error("Some debug messages");
logger.fatal("Some debug messages");