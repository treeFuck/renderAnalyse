# renderAnalyse

## 1. 项目架构
```bash
# tree -L 3 -l "src"

src
├── index.js ———————————————————— [服务入口文件]
├── store.js ———————————————————— [全局变量文件]
│
├── driver —————————————————————— [无头浏览器操作模块] 
│   └── browser.js              
│
├── task
|   ├── task.js                 
│   ├── fps ————————————————————— [fps 测试模块]
│   │   ├── generateFps.js
│   │   └── index.js
│   ├── memory —————————————————— [内存统计测试模块]
│   │   ├── index.js
│   │   └── parseMemory.js
│   ├── shot ———————————————————— [截屏测试模块]
│   │   └── index.js
│   └── time ———————————————————— [首屏渲染耗时测试模块]
│       ├── index.js
│       └── parseTime.js
│
├── router —————————————————————— [服务路由模块]
│   ├── index.js
│   ├── fpsTaskRouter.js 
│   ├── memoryTaskRouter.js
│   ├── renderTimeRouter.js
│   └── shotTaskRouter.js
│
└── utils ——————————————————————— [工具类]
    ├── mylog.js 
    └── index.js

```

## 2. 使用说明
1. 安装 nodejs，版本建议为 v16.0.0
2. 在项目目录下执行 `npm run init` 下载相关依赖，初始化项目
3. 在项目目录下执行 `npm run dev` 运行服务，服务默认占用 3000 端口
4. 根据测试需求，对服务发起 `http post` 请求，请求类型为 `application/json`，参数里格式如下
```json
{
    "url": "https://www.baidu.com/"
}
```

目前已经支持的请求路由：
1. `/fps` → 统计页面动画渲染流畅度
2. `/time` → 统计页面首屏渲染耗时
3. `/memory` → 统计页面内存使用情况
4. `/shot` → 给页面截个图


> test.js 里有几个测试案例，可执行 `node test.js` 运行

## 3. 遇到的坑

### 3.1 M1 mac Chromium 跑 page.tracing 时崩溃 

M1 mac 的 Chromium 跑 page.tracing 时会崩溃，详见[相关 issue](https://github.com/puppeteer/puppeteer/issues/8058)，为了解决这个问题，决定代码跟 Chromium 分离。

大体思路是，在 Linux 云服务器上装一个 chrome，启动 remote-debugging 模式，把暴露出来的 websoket 地址，给本地服务进行连接调试。

> [`Puppeteer`](https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v13.5.0&show=api-class-puppeteer) 使用 [DevTools 协议](https://chromedevtools.github.io/devtools-protocol/) 与 Chromium 进行通信。
>
> 通俗点说就是 Chromium 提供一种能力，通过暴露一个 websoket 地址与其他服务进行通信，其他服务会发送符合 Chrome DevTools Protocol 规范的指令给 Chromium，进而操控 Chromium 执行指定行为。
>
> puppeteer 的本质，就是 Chrome DevTools Protocol 的 node api 封装。
>
> 而 Chromium，则可以通过下面的 bash 命令，开启一个 websoket 地址，供其他服务连接。

```bash
chrome --headless --remote-debugging-port=9222 --remote-debugging-address=本机ip地址

# 查询本机 ip 地址
ifconfig | grep inet
```

### 3.1 跑 page.tracing 时没有合成器线程的 event trace 

这是因为 `page.tracing.start` 在追踪页面渲染的时候，默认不抓合成器线程的 log，需要额外指定。
```js
// cc 就是合成器线程的缩称
page.tracing.start({categories: ['cc']});
```


## 4. 附录
[Puppeteer 中文文档](https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v13.5.0&show=api-class-puppeteer)

[Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)

[chromium 启动的参数大全](https://peter.sh/experiments/chromium-command-line-switches/)

[我们是如何在CI流水线统计web前端FPS的？](https://cloud.tencent.com/developer/article/1841053)

[强大的可视化利器 Chrome Trace Viewer 使用详解](https://2010-2021.limboy.me/2020/03/21/chrome-trace-viewer/)

[Trace Event Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview)

[window.performance.timing 教程](https://juejin.cn/post/6864444644912103432)

[MemoryInfra](https://chromium.googlesource.com/chromium/src/+/master/docs/memory-infra)





