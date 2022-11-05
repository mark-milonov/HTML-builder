module.exports = buildHtml

function buildHtml(tempFile, compPath, buildHtmlFile) {
  const path = require('path');
  const fs = require('fs');
  
  const rs = fs.createReadStream(tempFile, {encoding: 'utf-8'});
  let tempStr = ''
  let countModules = 0;
  rs.on('data', data => tempStr += data)
  rs.on('error', err => addBlock(`Can't read "template.html" file`, err))
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
        rsComp.on('error', err => {compData = addBlock(`Can't read component file "${compFile}.html"`, err)});
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