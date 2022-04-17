
/**
 * @description 服务入口文件
 * @author bolewang
 * @date 2022-04-07
 */

import Koa from 'koa';
import koaBody from 'koa-body';
import router from './router/index.js';
import MyBrowser from './driver/browser.js';
import axios from 'axios';

let init = async () => {

  const wSEndpoint = (await axios.get('http://175.178.108.248:6666/test')).data.wsEndpoint;
  // const wSEndpoint = 'ws://192.168.2.7:9222/devtools/browser/c5e6e709-8890-4ccd-bc03-8d9b30d22a94';
  const driver = new MyBrowser();
  await driver.init(1, wSEndpoint, 10);

  const app = new Koa();
  app.use(koaBody());
  app.use(router.routes()).use(router.allowedMethods());
  
  app.listen(3000, () => {
    console.log('请访问: http://127.0.0.1:3000/fps');
  })
};

init();