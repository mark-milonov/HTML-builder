const process = require('process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const file = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(file, {encoding: 'utf-8'})

console.log('Enter your text: ')
readline.createInterface({input: process.stdin, output: process.stdout})
  .on('line', line => {
    if(line == 'exit') process.exit();
    ws.write(line+'\n');
  })
  .on('error', err => console.log(err))
process.on('exit', () => console.log('Finished writing!'))