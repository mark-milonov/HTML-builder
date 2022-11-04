const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');
let str = '';

const rs = fs.createReadStream(file, 'utf-8');
rs.on('data', chanck =>  str += chanck);
rs.on('end', () => console.log(str));
rs.on('error', err => console.log(err));