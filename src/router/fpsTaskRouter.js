/**
 * @description 服务路由，调用无头浏览器，获取页面的渲染的 FPS 信息
 * @author bolewang
 * @date 2022-04-07
 */

import { fpsTask } from "../driver/task.js";

export default async function fpsTaskRouter(ctx) {

  ctx.body = await new Promise((resolve) => {
    // 新建任务
    const task = new fpsTask({
      reqTime: ctx.reqTime,
      url: 'https://mp.weixin.qq.com/s/FeFA06c1B6l2a624JI4nkA',
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
    // 将任务交给无头浏览器处理
    task.popTask();

  });

}