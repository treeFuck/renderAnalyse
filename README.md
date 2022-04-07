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




