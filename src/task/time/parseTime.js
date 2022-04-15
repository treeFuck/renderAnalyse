export default (time) => {

  return [
    { msg: '重定向时间', data: time.redirectEnd - time.redirectStart },
    { msg: 'DNS解析耗时', data: time.domainLookupEnd - time.domainLookupStart },
    { msg: 'TCP链接耗时', data: time.connectEnd - time.connectStart },
    { msg: 'HTTP请求耗时', data: time.responseEnd - time.requestStart },
    { msg: '解析dom树耗时', data: time.domComplete - time.domInteractive },
    { msg: '页面白屏耗时', data: time.responseStart - time.navigationStart },
    { msg: '页面总体加载耗时', data: time.loadEventEnd - time.navigationStart }
  ];

}