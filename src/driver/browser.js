/**
 * @description 无头浏览器操作类，封装了 puppeteer 的操作，内部采取任务队列调度机制，保证提供一个 page 给 class Task 运行
 * @author bolewang
 * @date 2022-04-07
 */

import puppeteer from 'puppeteer';
import { logger } from '../utils/index.js';
import { varDriver } from '../store.js';
import { TaskType } from '../task/task.js';

const browserArgs = {
  // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: [
		// '–disable-gpu',
		// '–disable-dev-shm-usage',
		// '–disable-setuid-sandbox',
		// '–no-first-run',
		// '–no-sandbox',
		// '–no-zygote',
		// '–single-process'
	]
};

// const testWSEndpoint = 'ws://127.0.0.1:9222/devtools/browser/087c1d6b-0583-43bd-ba92-ce8b753b44ba';
const testWSEndpoint = 'ws://192.168.2.6:9222/devtools/browser/af4cef31-8b18-4193-a2c7-36c00b72292e';


/**
 * 无头浏览器操作类
 * @class MyBrowser
 */
export default class MyBrowser {
  browser =  null;    // 浏览器实例
  wsEndpoint = null;  // 浏览器 websocket 的地址（断开连接后方便重连）
  maxTaskNum = 5;     // 最大任务数（浏览器同时可以开启的页面数量）
  nowTaskNum = 0;     // 当前处理的任务数
  nowTaskSet = null;  // 当前正在运行的任务
  taskArr = [];       // 待处理任务队列
  launching = false;  // 是否重启中
  isTracing = false;  // 是否在启动 tracing（执行 fps task 时）
  
  /**
   * 初始化无头浏览器
   * @param {Number} maxTaskNum 最大任务数
   */
  async init(maxTaskNum = 5) {
    this.launching = true;
    this.browser = await puppeteer.connect({
      browserWSEndpoint: testWSEndpoint
    });
    this.wsEndpoint = testWSEndpoint;
    // this.browser = await puppeteer.launch(browserArgs);
    // this.wsEndpoint = this.browser.wsEndpoint();
    this.maxTaskNum = Math.max(Math.min(maxTaskNum, 15), 5);
    // TODO: 任务数先控制在 5-15 个，避免闹翔
    this.nowTaskNum = 0; 
    this.nowTaskSet = new Set();
    this.isTracing = false;

    this.browser.on('disconnected', (err) => {
      logger.error('Chromium 被关闭或崩溃', err);
      this.browser = null;
    });

    this.launching = false;
    logger.info("Chromium 启动成功");

    varDriver(this); // 将 Driver 变量挂到全局
  }

  /**
   * 如果无头浏览器崩了，进行重启
   */
  async reLaunch() {
    if (this.launching) return;
    this.launching = true;
    try {
      logger.info("Chromium 重连中……");
      this.browser = await puppeteer.connect({
        browserWSEndpoint: this.wsEndpoint
      });
    } catch(err) {
      logger.info('Chromium 重连失败，重启中……');
      await this.init(this.maxTaskNum);
    }
    this.launching = false;
    this.isTracing = false;
    // 重启后，正在执行的任务应该都丢掉了，但 taskArr 里的任务可以继续跑
    this.continueTask();
  }

  /**
   * 获取一个空的 page，给 Task 使用
   * @returns {Page} 返回一个无头浏览器新开的页面 
   */
  async getOnePage() {
    const page = await this.browser.newPage();
    page.on('pageerror', (err) => logger.error('页面异常', err));
    // page.on('console', (msg) => console.log('页面 console 输出', msg.text()));
    
    return page;
  }

  /**
   * 收到一个新任务，待处理（注意，该函数会被高并发调用，书写函数时请注意）
   * @param {Task} task 无头浏览器任务，来自 src/driver/task.js
   */
  getTask(task) {
    // 判断一下浏览器有没有崩，崩了则重启，并把任务都放到任务队列待处理
    if (!this.browser) {
      !this.launching && this.reLaunch();
      this.taskArr.unshift(task);
      return;
    }

    // fpsTask 不能并行，如果有 fpsTask 在跑，此时又来了新的 fpsTask，直接放队尾
    if(task.type === TaskType.FPS && this.isTracing) {
      this.taskArr.unshift(task);
      return;
    }

    // 浏览器运行正常
    if (this.nowTaskNum < this.maxTaskNum) {
      // 空闲，直接处理
      this.handleOneTask(task);
    } else {
      // 非空闲，入任务队列，待处理
      this.taskArr.unshift(task);
    }

  }

  /**
   * 用一个新 page 去处理一个 Task
   * @param {Task} task 无头浏览器任务，来自 src/driver/task.js
   */
  async handleOneTask(task) {
    this.nowTaskNum++;
    this.nowTaskSet.add(task);
    if (task.type === TaskType.FPS) this.isTracing = true;

    logger.info(task.type, TaskType.FPS, this.isTracing);    
    logger.info(`浏览器当前处理任务数：${this.nowTaskNum}，最大同时处理任务数：${this.maxTaskNum}，待处理任务数：${this.taskArr.length}`);
    logger.info(`处理中-任务队列：[${[...this.nowTaskSet].map(task=>task.type)}]`);
    logger.info(`待处理-任务队列：[${this.taskArr.map(task=>task.type)}]`);
    logger.info(`${this.isTracing}`)

    const page = await this.getOnePage();
    try {
      await task.run(page);
    } catch(err) {
      logger.error(`[${task.reqID}] task error`);
    }
    await page.close();

    this.nowTaskNum--;
    this.nowTaskSet.delete(task);
    if (task.type === TaskType.FPS) this.isTracing = false;
    
    // 执行完毕，继续从任务队列取新任务去执行
    this.continueTask();
  }

  /**
   * 继续无头浏览器任务
   */
  async continueTask() {
    if(!this.taskArr.length) return;

    /**
     * @description 如果有 fpsTask 任务在执行，且 nextTask 也是 fpsTask，则从任务队列按序找出第一个非 fpsTask 的任务
     */
    let nextTask = this.taskArr.pop();
    if (this.isTracing) {
      let findTime = this.taskArr.length + 1; // 限定轮询次数，避免死循环
      while(nextTask.type === TaskType.FPS && findTime) {
        this.taskArr.unshift(nextTask);
        nextTask = this.taskArr.pop();
        findTime--;
      }
      if (findTime === 0) {
        // 任务队列里全是 fpsTask，结束函数，等待上一个 fpsTask 结束后再触发执行
        this.taskArr.unshift(nextTask);
        return;
      }
    }

    this.handleOneTask(nextTask);

  }

}
