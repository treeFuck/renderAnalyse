/**
 * @description 服务路由，调用无头浏览器，获取页面的性能指标
 * @author bolewang
 * @date 2022-04-14
 */

import memoryTask from "../task/memory/index.js";

export default async function memoryTaskRouter(ctx) {

  ctx.body = await new Promise((resolve) => {

    const task = new memoryTask({
      reqID: ctx.reqID,
      url: 'https://mp.weixin.qq.com/s/FeFA06c1B6l2a624JI4nkA',
      sucCall: (res) => {
        resolve({
          ret: 0,
          msg: 'success',
          data: null
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