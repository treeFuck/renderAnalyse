
const parseToMB = (num) => {
  return (num / (1024 * 1024)).toFixed(2) + 'MB';
}


export default (json) => {
  return [
    { msg: '页面占用堆内存大小', data: parseToMB(json.JSHeapUsedSize) },
    { msg: '页面分配堆内存大小', data: parseToMB(json.JSHeapTotalSize) },
  ];
}