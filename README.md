# renderAnalyse

## 1. 项目架构
```bash
# tree -L 3 -l "src"
src
├── index.js [服务入口文件]
├── store.js [全局变量文件]
│
├── driver [无头浏览器模块]             
│   ├── browser.js  [无头浏览器操作 class]
│   └── task.js     [无头浏览器任务 class]  
│        
├── router [服务路由模块]
│   ├── fpsTaskRouter.js [fps 请求路由]
│   └── index.js
│
└── utils [工具类]
    ├── mylog.js [日志输出工具]
    └── index.js
```

## 2. 使用说明



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





