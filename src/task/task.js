/**
 * @description 任务类，封装无头浏览器的任务操作
 * @author bolewang
 * @date 2022-04-07
 */
import { Driver } from '../store.js';
import { logger } from '../utils/index.js';

export const TaskType = {
  FPS: 'fps',
  SHOT: 'screenshot',
  MEMO: 'memory',
  TIME: 'renderTime'
}

/**
 * @class Task 无头浏览器任务基础类
 */
export class Task {
  constructor(type, reqID, url, taskFun, sucCall, failCall) {
    this.type = type;             // 类型，取值范围见 TaskType
    this.reqID = reqID;           // 请求 ID
    this.url = url;               // 页面 url
    this.taskFun = taskFun;       // 自定义页面操作（taskFun 必须是 promise 函数）
    this.sucCall = sucCall;       // 成功回调
    this.failCall = failCall;     // 失败回调
  }
  // 成功回调
  success(res) {
    typeof this.sucCall === 'function' && this.sucCall(res);
  }
  // 失败回调
  fail(err) {
    typeof this.failCall === 'function' && this.failCall(err);
  }
  // 将任务放入无头浏览器任务队列
  popTask() {
    Driver.getTask(this); 
  }
  // 执行 taskFun 里的自定义页面操作
  async run(page) {
    try {
      this.success(this.taskFun && await this.taskFun(page))
    } catch (err) {
      logger.error(`[${this.reqID}] task error:`, err);
      this.fail(err);

    }
  }
};





