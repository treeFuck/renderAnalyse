
/**
 * @description 服务入口文件
 * @author bolewang
 * @date 2022-04-07
 */

import Koa from 'koa';
import koaBody from 'koa-body';
import router from './router/index.js';
import MyBrowser from './driver/browser.js';

let init = async () => {
  
  const driver = new MyBrowser();
  await driver.init(10);

  const app = new Koa();
  app.use(koaBody());
  app.use(router.routes()).use(router.allowedMethods());
  
  app.listen(3000, () => {
    console.log('请访问: http://127.0.0.1:3000/fps');
  })
};

init();