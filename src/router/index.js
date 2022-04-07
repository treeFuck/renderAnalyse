/**
 * @description 服务路由，调用无头浏览器的服务
 * @author bolewang
 * @date 2022-04-07
 */

import Router from 'koa-router';
import { logger } from '../utils/index.js';
import fpsTaskRouter from './fpsTaskRouter.js'; 
 
const router = new Router();

let reqLog = async (ctx, next) => {
  let reqTime = new Date();
  ctx.reqTime = reqTime.toLocaleString();
  await next();
  logger.info(`[${ctx.reqTime}] ${ctx.method} ${ctx.url} - ${(new Date() - reqTime) / 1000} s return ${JSON.stringify(ctx.body)}`);
}

router.get('/fps', reqLog, fpsTaskRouter);
 
 export default router;