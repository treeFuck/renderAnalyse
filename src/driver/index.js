import puppeteer from 'puppeteer';
import { logger } from '../../mylog.js';

const browserArgs = {
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

export let taskMap = new Map(); // 存储 [正在运行/待运行] 的浏览器任务
export let myBrowser = null; // 存储生成的无头浏览器示例

// 任务类
class PageTask {
  constructor(taskId, url, sucFun, failFun, scriptFun, data) {
    this.taskId = taskId; // 每一个任务的唯一id
    this.url = url; // url
    this.scriptFun = scriptFun; // 注入脚本
    this.sucFun = []; // 成功回调数组
    this.failFun = []; // 失败回调数组
    this.data = data; // 处理任务所需的原始数据

    taskMap.set(taskId, this); // 新增任务
  }
  addCbFun(sucCall, failCall) {
    sucCall && this.sucFun.push(sucCall);
    failCall && this.failFun.push(failCall);
  }
  success(res) {
    for (let fun of this.sucFun) {
      typeof fun === 'function' && fun(res);
    }
    taskMap.delete(this.taskId); // 任务结束，移除
  }
  fail(err) {
    for (let fun of this.failFun) {
      typeof fun === 'function' && fun(err);
    }
    taskSet.delete(this.taskId); // 任务结束，移除
  }
}


// 浏览器操作类
export class MyBrowser {
  browserArr = []; // 浏览器列表
  idlePageArr = []; // 空闲 page 列表
  taskQueue = []; // 暂未处理的任务

  // 初始化 page 列表
  async init(browserNum, pageNum) {
    for (let i = 0; i < browserNum; i++) {
      let browser = await puppeteer.launch(browserArgs);
      browser.on('disconnected', (err) => {
        logger.error('Chromium 被关闭或崩溃', err);
      })
      this.browserArr[i] = browser;
      for (let j = 0; j < pageNum; j++) {
        let page = await browser.newPage();
        await page.goto('file:///Users/bolewang/Desktop/mmbizfilter/src/controller/darkMode/index.html');
        page.on('console', (msg)=> console.log('页面 console 输出', msg.text()));
        page.on('pageerror', (err) => {
          logger.error('页面异常', err);
        })
        this.idlePageArr.push(page); 
      }
    }
    myBrowser = this;
  }  

  // 创建一个新的任务
  newOneTask({taskId, type, data}) {
    let task = new PageTask(taskId, type, data); // 创建一个任务
    logger.info(`当前空闲 page 数=${this.idlePageArr.length}，待处理任务数=${this.taskQueue.length}`);
    if (this.idlePageArr.length) {
      // 有空闲 page → 处理
      let page = this.idlePageArr.pop();
      this.handleOneTask(page, task);
    } else {
      // 无空闲 page → 放入任务队列，待处理
      this.taskQueue.push(task);
    }
    return task;
  }

  // 处理一个任务
  async handleOneTask(page, task) {
        
    if (task.type === 0) {
      try {
        // let start = new Date();
        let res = await this.darkModeTask(page, task.data);
        // console.log("处理 darkMode ，耗时", new Date() - start, 'ms');
        task.success(res);
      } catch(err) {
        logger.error('darkMode 处理报错', err);
        task.fail('DarkMode Task Fail');
      }
    } else {
      task.fail('Task Type Error');
    }
    if (this.taskQueue.length) {
      // 如果任务队列还有任务，继续用这个 page 去处理
      let newTask = this.taskQueue.shift();
      this.handleOneTask(page, newTask);
    } else {
      // 任务队列为空，回收 page
      this.idlePageArr.unshift(page);
    }
  } 

  // DarkMode 处理富文本
  async darkModeTask(page, {html, content}, test) {

    if (test) await page.goto(html);
    

    let start = new Date()
    let newContent = await page.evaluate((content) => {
      let elm = document.getElementById('js_content');
      elm.innerHTML = content;
      let styleArr = document.querySelectorAll('style');
      for (let styleDom of styleArr) {
        styleDom.remove();
      }
      Darkmode.run(document.body.querySelectorAll('*'), { mode: 'dark' });
      let res = elm.innerHTML;
      elm = null;
      return res;
    }, content);

    let style = await page.$eval('style', el => el.innerText);
    console.log("DarkMode 处理 耗时", new Date() - start, 'ms');
    return {
      style: style,
      content: newContent
    };
  }

  async newOneTask2({taskId, type, data}) {
    let start = new Date();
    let page = await this.browserArr[0].newPage();
    console.log("创建一个 tab 页，耗时", new Date() - start, 'ms');
    start = new Date();
    let res = await this.darkModeTask(page, data, true);
    console.log("处理 darkMode ，耗时", new Date() - start, 'ms');
    start = new Date();
    await page.close();
    console.log("关闭页面，耗时", new Date() - start, 'ms');
    return res;
  }
  

}
