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
      // await page.goto(this.url);
      // await page.tracing.start({categories: ['cc', 'memory']});
      // await await page.waitForTimeout(3000);
      // const traceData = JSON.parse((await page.tracing.stop()).toString());
      // this.success(generateFps(traceData));

      await page.goto(this.url);
      await page.evaluate(() => {
        let start = new Date();
        let renderTime = 0;
        let fun = () => {
          renderTime++;
          renderTime % 10 === 0 && ( window._FPS_ = renderTime / ((new Date() - start) / 1000));
          window.requestAnimationFrame(fun);
        };
        fun();
      });
      await page.waitForTimeout(2000);
      this.success((await page.evaluate(() => window._FPS_)).toFixed(2));

    } catch(err) {
      logger.error(`[${this.reqID}] fps task error:`, err);
      this.fail(err);
    }
  }
}