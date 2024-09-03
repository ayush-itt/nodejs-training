const path = require('node:path');

const configPath = path.join(__dirname, 'config.json');
const config = { source: './client', target: './cloud' };

module.exports = {configPath, config};