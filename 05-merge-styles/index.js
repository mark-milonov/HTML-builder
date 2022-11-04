const bundleFile = require('./style-bundler');

const path = require('path');
const styles = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist', 'bundle.css');

bundleFile(styles, dist);