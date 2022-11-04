module.exports = copyDir;

async function copyDir(fromPath, toPath) {
  const fs = require('fs');
  const fsProm = require('fs/promises')
  const path = require('path');

  await fsProm.mkdir(toPath, {recursive: true})

  fs.readdir(fromPath, {withFileTypes: true}, (err, files) => {
    if(err) return console.log(err);
    files.forEach(file => {
      const fromFile = path.join(fromPath, file.name)
      const toFile = path.join(toPath, file.name)
      if(file.isFile()) {
        const ws = fs.createWriteStream(toFile);
        const rs = fs.createReadStream(fromFile);
        rs.pipe(ws)
          .on('error', err => console.log(err));
      }
      if(file.isDirectory()) {
        copyDir(fromFile, toFile)
      }
    })
  })
}