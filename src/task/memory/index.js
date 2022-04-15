/**
 * @class memoryTask 无头浏览器任务--统计内存
 * @extends Task
 * @description 统计内存使用情况
 */

import { logger } from '../../utils/index.js';
import { Task, TaskType } from '../task.js';

export default class memoryTask extends Task {
  constructor({ reqID, url, sucCall, failCall }) {
    super(TaskType.MEMO, reqID, url, null, sucCall, failCall);
  }

  async run(page) {
    try {
      await page.goto(this.url);
      this.success(await page.metrics());
    } catch(err) {
      logger.error(`[${this.reqID}] memory task error:`, err);
      this.fail(err);
    }
  }
}