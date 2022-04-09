/**
 * @class screenshotTask 无头浏览器任务--截屏
 * @extends Task
 * @description 可有可无的 task，当做基础模板吧
 */

import { logger } from '../../utils/index.js';
import { Task, TaskType } from '../task.js';

export default class screenshotTask extends Task {
  constructor({ reqID, url, sucCall, failCall }) {
    super(TaskType.SHOT, reqID, url, null, sucCall, failCall);
  }

  async run(page) {
    try {
      await page.goto(this.url);
      this.success(await page.screenshot());
    } catch(err) {
      logger.error(`[${this.reqID}] screenshot task error:`, err);
      this.fail(err);
    }
  }
}