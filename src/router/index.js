/**
 * @description 服务路由，调用无头浏览器的服务
 * @author bolewang
 * @date 2022-04-07
 */

import Router from 'koa-router';
import { logger } from '../utils/index.js';
import fpsTaskRouter from './fpsTaskRouter.js'; 
import shotTaskRouter from './shotTaskRouter.js';
import memoryTaskRouter from './memoryTaskRouter.js';
import renderTimekRouter from './renderTimeRouter.js'
// import { Driver } from '../store.js';
 
const router = new Router();

let _reqId = 0;

const reqLog = async (ctx, next) => {
  ctx.reqID = _reqId++;
  ctx.reqTime = new Date();
  logger.info(`[${ctx.reqID}] [request] ${ctx.method} ${ctx.url} `);
  await next();
  logger.info(`[${ctx.reqID}] [response] ${ctx.method} ${ctx.url} - ${(new Date() - ctx.reqTime) / 1000} s return ${JSON.stringify(ctx.body)}`);
}

const filter = async (ctx, next) => {
  const url = ctx.request.body.url;
  if (!url) {
    ctx.body = { ret: -1, msg: 'url 不能为空', data: null };
  } else {
    await next();
  }
}

router.post('/fps', reqLog, filter, fpsTaskRouter);
router.post('/memory', reqLog,filter, memoryTaskRouter);
router.post('/time', reqLog, filter, renderTimekRouter);
router.post('/shot', reqLog, filter, shotTaskRouter);

router.get('/test', reqLog, filter, async (ctx) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  ctx.body = {
    ret: 0,
    data: null
  }
});
 
 export default router;