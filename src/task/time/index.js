/**
 * @class renderTimeTask 无头浏览器任务--统计首屏渲染耗时
 * @extends Task
 * @description 
 */

import { logger } from '../../utils/index.js';
import { Task, TaskType } from '../task.js';
import parseTime from './parseTime.js';

export default class renderTimeTask extends Task {
  constructor({ reqID, url, sucCall, failCall }) {
    super(TaskType.TIME, reqID, url, null, sucCall, failCall);
  }

  async run(page) {
    try {
      await page.goto(this.url);
      const timeing = await page.evaluate(() => JSON.stringify(window.performance.timing));
      this.success(parseTime(JSON.parse(timeing)));
    } catch(err) {
      logger.error(`[${this.reqID}] renderTime task error:`, err);
      this.fail(err);
    }
  }
}