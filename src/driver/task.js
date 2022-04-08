/**
 * @description 任务类，封装无头浏览器的任务操作
 * @author bolewang
 * @date 2022-04-07
 */
import { logger } from '../utils/index.js';
import { Driver } from '../store.js';

export const TaskType = {
  FPS: 'fps',
  SHOT: 'screenshot'
}


/**
 * @class Task 无头浏览器任务
 */
class Task {
  constructor(type, reqID, url, sucCall, failCall) {
    this.type = type;             // 类型，取值范围：['fps']
    this.reqID = reqID;       // 请求时间（一个 task 对应一个请求，以请求时间作为唯一标识）
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
 * @class screenshotTask 无头浏览器任务--截屏
 * @extends Task
 */
 export class screenshotTask extends Task {
  constructor({ reqID, url, sucCall, failCall }) {
    super(TaskType.SHOT, reqID, url, sucCall, failCall);
  }

  async run(page) {
    try {
      await page.goto(this.url);
      // const fileUrl = new URL(`../../dist/xiuer${parseInt(Math.random() * 10, 10)}.png`, import.meta.url);
      // await page.screenshot({path: fileUrl.pathname});
      this.success(await page.screenshot());
    } catch(err) {
      logger.error(`[${this.reqID}] screenshot task error:`, err);
      this.fail(err);
    }
  }
}

/**
 * @class fpsTask 无头浏览器任务--分析页面渲染性能的
 * @extends Task
 * @description 每个浏览器一次只能激活一条 tracing，所以 fpsTask 不能并行，这部分在 browser 里做了特殊处理
 */
export class fpsTask extends Task {
  constructor({ reqID, url, sucCall, failCall }) {
    super(TaskType.FPS, reqID, url, sucCall, failCall);
  }

  async run(page) {
    try {
      // TODO: 渲染完毕、读取 fps 数据，分析 fps，返回结果
      await page.goto(this.url);
      await page.waitForTimeout(500);
      this.success('fps');
    } catch(err) {
      logger.error(`[${this.reqID}] fps task error:`, err);
      this.fail(err);
    }
  }
}

