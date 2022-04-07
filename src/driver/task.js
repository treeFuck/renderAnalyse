/**
 * @description 任务类，封装无头浏览器的任务操作
 * @author bolewang
 * @date 2022-04-07
 */
import { logger } from '../utils/index.js';
import { Driver } from '../store.js';

/**
 * @class Task 无头浏览器任务
 */
class Task {
  constructor({ reqTime, url, sucCall, failCall }) {
    this.reqTime = reqTime;       // 请求时间（一个 task 对应一个请求，以请求时间作为唯一标识）
    this.url = url;               // 页面 url
    this.sucCall = sucCall;       // 成功回调
    this.failCall = failCall;     // 失败回调
  }
  success(res) {
    typeof this.sucCall === 'function' && this.sucCall(res);
  }
  fail(err) {
    typeof this.failCall === 'function' && this.failCall(err);
  }
  popTask() {
    Driver.getTask(this); // 将任务放入无头浏览器任务队列
  }
};

/**
 * @class fpsTask 无头浏览器任务--分析页面渲染性能的
 * @extends Task
 */
export class fpsTask extends Task {
  constructor(reqTime, url, sucFun, failFun) {
    super(reqTime, url, sucFun, failFun);
  }

  async run(page) {
    try {
      // TODO: 渲染完毕、读取 fps 数据，分析 fps，返回结果
      await page.goto(this.url);
      const fileUrl = new URL(`../../dist/xiuer${parseInt(Math.random() * 10, 10)}.png`, import.meta.url);
      await page.screenshot({path: fileUrl.pathname});
      this.success('截图成功');
    } catch(err) {
      logger.error(`[${this.reqTime}] fps task error:`, err);
      this.fail(err);
    }
  }
}