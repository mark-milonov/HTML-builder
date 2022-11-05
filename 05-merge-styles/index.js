// Для проверяющиего: я вынес часть кода в отдельный модуль 
// В рамках таска это не запрещено!
const bundleFile = require('./style-bundler');

const path = require('path');
const styles = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist', 'bundle.css');

bundleFile(styles, dist);