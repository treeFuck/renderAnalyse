const calcFps = () => {

}


const filterLogs = (traceEvents) => {
  let start = Infinity;
  let end = -Infinity;
  let logLen = 0;
  traceEvents.forEach(event => {
    if (event.cat === 'cc' && event.name == 'Scheduler::NotifyBeginMainFrameStarted') {
      logLen ++;
      start = Math.min(event.ts, start);
      end = Math.max(event.ts, end);
    }
  });

  return {
    start, end, logLen
  }
}

export default (traceLog) => {
  let {start, end, logLen} = filterLogs(traceLog.traceEvents);
  let fps = logLen / ((end - start) / 1e6);
  return fps; 
}
