/**
 * @description 服务路由，调用无头浏览器，获取页面的截图
 * @author bolewang
 * @date 2022-04-07
 */

import fs from 'fs';
import { URL } from 'url';
import { screenshotTask } from "../driver/task.js";

export default async function shotTaskRouter(ctx) {

  ctx.body = await new Promise((resolve) => {

    const task = new screenshotTask({
      reqID: ctx.reqID,
      url: 'https://mp.weixin.qq.com/s/FeFA06c1B6l2a624JI4nkA',
      sucCall: (res) => {

        const fileUrl = new URL(`../../dist/made${parseInt(Math.random() * 20, 10)}.png`, import.meta.url);
        fs.writeFile(fileUrl.pathname, res, err => {});
        
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