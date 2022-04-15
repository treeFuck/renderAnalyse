/**
 * @description 服务路由，调用无头浏览器，获取首屏渲染耗时
 * @author bolewang
 * @date 2022-04-14
 */

import renderTimeTask from "../task/time/index.js";

export default async function renderTimekRouter(ctx) {

  ctx.body = await new Promise((resolve) => {

    const task = new renderTimeTask({
      reqID: ctx.reqID,
      url: 'http://175.178.108.248:886/homepage.html',
      sucCall: (res) => {
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