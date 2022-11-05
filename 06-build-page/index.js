// Хотел вынести все в отдельный файлы,
// но сказали говнокодить все в 1
// удачи в проверке
// const buildHtml = require('./build-html')
// const copyDir = require('./copy-dir')
// const bundleFile = require('./style-bundler')

const path = require('path');
const fsProm = require('fs/promises');

const buildPath = path.join(__dirname, "project-dist");

const tempFile = path.join(__dirname, "template.html");
const compPath = path.join(__dirname, "components");
const buildHtmlFile = path.join(buildPath, "index.html");

const fromAssetsPath = path.join(__dirname, "assets");
const toAssetsPath = path.join(buildPath, "assets");

const fromStylesFolder = path.join(__dirname, "styles");
const toStylesFile = path.join(buildPath, "style.css");

async function build() {
  try {
    await fsProm.rm(buildPath, {recursive: true, force: true});
    await fsProm.mkdir(buildPath, {recursive: true});
    
    copyDir(fromAssetsPath, toAssetsPath)
    bundleFile(fromStylesFolder, toStylesFile)
    buildHtml(tempFile, compPath, buildHtmlFile);
  } catch (err) {
    console.log(err)
  }
}

build()

async function copyDir(fromPath, toPath) {
  const fs = require('fs');
  const fsProm = require('fs/promises')
  const path = require('path');

  await fsProm.rm(toPath, {recursive: true, force: true})
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

function bundleFile(fromFolder, toFile) {
  const fs = require('fs');
  const path = require('path');
  const ws = fs.createWriteStream(toFile, 'utf-8');
  fs.readdir(fromFolder, {withFileTypes: true, encoding: 'utf-8'}, (err, files) => {
    if(err) return console.log(err);
    files
      .filter(file => file.isFile())
      .filter(file => path.parse(file.name).ext == '.css')
      .forEach(file => {
        const filePath = path.join(fromFolder, file.name);
        const rs = fs.createReadStream(filePath);
        rs.pipe(ws);
      })
  });
}

function buildHtml(tempFile, compPath, buildHtmlFile) {
  const path = require('path');
  const fs = require('fs');
  
  const rs = fs.createReadStream(tempFile, {encoding: 'utf-8'});
  let tempStr = ''
  let countModules = 0;
  rs.on('data', data => tempStr += data);
  rs.on('error', err => {
    const title = `Can't read "template.html" file`;
    addBlock(title, err);
    console.log("\033[31m" + title + "\033[0m");
  });
  rs.on('close', () => {
    const tempArr = tempStr
      .split('{')
      .map(data => data == '' ? '{' : data)
      .map(data =>
        data.split('}')
          .map(data => data == '' ? '}' : data)
      ).flat()
    tempArr.forEach((compFile, i, arr) => {
      if(arr[i-1] == '{' && arr[i+1] == '}') {
        countModules++;
        let compData = '';
        const compFilePath = path.join(compPath, compFile + '.html');
        const rsComp = fs.createReadStream(compFilePath, {encoding: 'utf-8'});
        rsComp.on('data', data => compData += data);
        rsComp.on('error', err => {
          const title = `Can't read component file "${compFile}.html"`
          compData = addBlock(title, err);
          console.log("\033[31m" + title + "\033[0m");
        });
        rsComp.on('close', () => {
          arr[i] = compData;
          countModules--;
          if(countModules == 0) {
            const ws = fs.createWriteStream(buildHtmlFile)
            const toWrite = tempArr
              .flat()
              .filter(data => data == '{' || data == '}' ? '' : data)
              .join('')
            ws.write(toWrite, err => {if(err) console.log(err)})
          }
        })
      }
    })
  })

  function addBlock(title, text) {
    return `<div class="build-error">
              <h2 class="build-error__title">${title}</h2>
              <p class="build-error__text">${text}</p>
            </div>`
  }
}