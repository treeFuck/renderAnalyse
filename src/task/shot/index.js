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
      await page.waitForTimeout(2000);
      // const fileUrl = new URL(`../../dist/xiuer${parseInt(Math.random() * 10, 10)}.png`, import.meta.url);
      // await page.screenshot({path: fileUrl.pathname});
      this.success(await page.screenshot());
    } catch(err) {
      logger.error(`[${this.reqID}] screenshot task error:`, err);
      this.fail(err);
    }
  }
}