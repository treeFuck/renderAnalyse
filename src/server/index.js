
import Koa from 'koa';
import koaBody from 'koa-body';
import router from './router/index.js';
import { MyBrowser } from './util/browser.js';

let init = async () => {
  
  const myBrowser = new MyBrowser();
  await myBrowser.init(4, 10);

  const app = new Koa();
  app.use(koaBody());
  app.use(router.routes()).use(router.allowedMethods());
  
  app.listen(3000, () => {
    console.log('请访问: http://127.0.0.1:3000/test');
  })
};
init();