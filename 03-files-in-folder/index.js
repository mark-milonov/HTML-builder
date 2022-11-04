
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'secret-folder')

fs.readdir(dir, {withFileTypes: true}, (err, files) => {
  if(err) return console.log(err);
  files
    .filter(file => file.isFile())
    .forEach(file => {
      getStat(file)
        .then((file) => {
          console.log(`${file.name} - ${file.ext} - ${file.size}`)
        })
        .catch(err => console.log(err))
    })
})

async function getStat(file) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(dir, file.name)
    fs.stat(filePath, (err, stats) => {
      if(err) return reject(err)
      const objFile = {
        name: path.parse(file.name).name,
        ext: path.parse(file.name).ext.substring(1),
        size: stats.size
      }
      resolve(objFile)
    })
  })
}