/**
 * @description 服务路由，调用无头浏览器，获取页面的渲染的 FPS 信息
 * @author bolewang
 * @date 2022-04-07
 */

// import fs from 'fs';
// import { URL } from 'url';
import fpsTask from "../task/fps/index.js";

export default async function fpsTaskRouter(ctx) {

  ctx.body = await new Promise((resolve) => {

    const task = new fpsTask({
      reqID: ctx.reqID,
      url: ctx.request.body.url,
      sucCall: (res) => {
        // try {
        //   const fileUrl = new URL(`../../dist/trace${parseInt(Math.random() * 20, 10)}.json`, import.meta.url);
        //   fs.writeFile(fileUrl.pathname, res, err => {});

        // } catch(err) {
        //   resolve({
        //     ret: -2,
        //     msg: 'fail',
        //     data: err
        //   });
        // };
        
        resolve({
          ret: 0,
          msg: 'success',
          data: res
        });
      },
      failCall: (err) => {
        resolve({
          ret: -1,
          msg: 'fail',
          data: err
        });
      }
    });
    
    task.popTask();

  });

}