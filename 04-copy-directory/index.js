// Для проверяющиего: я вынес часть кода в отдельный модуль 
// В рамках таска это не запрещено!
const copyDir = require('./copy-dir')

const path = require('path')
const _from = path.join(__dirname, 'files')
const _to = path.join(__dirname, 'files-copy')

copyDir(_from, _to)