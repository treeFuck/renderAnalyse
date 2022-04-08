/**
 * @description 服务路由，调用无头浏览器的服务
 * @author bolewang
 * @date 2022-04-07
 */

import Router from 'koa-router';
import { logger } from '../utils/index.js';
import fpsTaskRouter from './fpsTaskRouter.js'; 
import shotTaskRouter from './shotTaskRouter.js';
 
const router = new Router();

let _reqId = 0;

let reqLog = async (ctx, next) => {
  ctx.reqID = _reqId++;
  ctx.reqTime = new Date();
  logger.info(`[${ctx.reqID}] [request] ${ctx.method} ${ctx.url} `);
  await next();
  logger.info(`[${ctx.reqID}] [response] ${ctx.method} ${ctx.url} - ${(new Date() - ctx.reqTime) / 1000} s return ${JSON.stringify(ctx.body)}`);
}

router.get('/fps', reqLog, fpsTaskRouter);
router.get('/shot', reqLog, shotTaskRouter);
 
 export default router;