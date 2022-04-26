import axios from 'axios';

const ip = 'http://127.0.0.1:3000'

const testurl = [
  'http://175.178.108.248:886/render-test/fps.html', // 测试 fps，后面拼接 ?num=xxx 表示渲染 xxx 个动画
  'http://175.178.108.248:886/render-test/memory.html', // 测试 memory，后面拼接 ?num=xxx 表示创建 xxx 个大对象
  'http://175.178.108.248:886/render-test/time.html', // 测试 time，后面拼接 ?num=xxx 表示页面被 js 阻塞 xxx 毫秒
  'http://175.178.108.248:886/music/homepage.html',
]

const testTime = async (testArr = []) => {
  const promise = testArr.map(num => axios.post(ip + '/time', { url: testurl[2] + '?num=' + num }));
  const res = await Promise.all(promise);
  testArr.map(num => console.log(`\n 测试用例---js 阻塞页面 ${num} ms---http response: `, res.shift().data ));
}

const testMemory = async (testArr = []) => {
  const promise = testArr.map(num => axios.post(ip + '/memory', { url: testurl[1] + '?num=' + num }));
  const res = await Promise.all(promise);
  testArr.map(num => console.log(`\n 测试用例---创建 ${num} 个大对象的内存消耗---http response: `, res.shift().data ));

};

const testFps = async (testArr = []) => {
  const promise = testArr.map(num => axios.post(ip + '/fps', { url: testurl[0] + '?num=' + num }));
  const res = await Promise.all(promise);
  testArr.map(num => console.log(`\n 测试用例---同时渲染 ${num} 个动画---http response: `, res.shift().data ));
}

testTime([1000, 1500]);
// testMemory([100, 300, 500, 1000]);
// testFps([1000, 2000, 3000, 5000]);

