/**
 * @class fpsTask 无头浏览器任务--分析页面渲染性能的
 * @extends Task
 * @description 每个浏览器一次只能激活一条 tracing，所以 fpsTask 不能并行，这部分在 browser 里做了特殊处理
 */
import { logger } from '../../utils/index.js';
import { Task, TaskType } from '../task.js';
import generateFps from './generateFps.js';

export default class fpsTask extends Task {
  constructor({ reqID, url, sucCall, failCall }) {
    super(TaskType.FPS, reqID, url, null, sucCall, failCall);
  }

  async run(page) {
    try {
      // TODO: 渲染完毕、读取 fps 数据，分析 fps，返回结果
      // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36')
      await page.goto(this.url);
      await page.tracing.start({
        categories: ['cc', 'memory']
      });
      await await page.waitForTimeout(3000);
      const traceData = JSON.parse((await page.tracing.stop()).toString());
      this.success(generateFps(traceData));

      // await page.goto(this.url);
      // await page.waitForTimeout(1000);
      // this.success(null);
    } catch(err) {
      logger.error(`[${this.reqID}] fps task error:`, err);
      this.fail(err);
    }
  }
}