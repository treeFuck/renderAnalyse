
import fs from 'fs';
import generateFps from './src/task/fps/generateFps.js'

let test = async () => {
  let data = await new Promise((resolve, reject) => {
    fs.readFile('./trace_test.json', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data.toString()))
    });
  });

  
  console.log(generateFps(data));
  
}

test();

