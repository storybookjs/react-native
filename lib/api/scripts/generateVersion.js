const fs = require('fs');
const path = require('path');

const output = version => `export const version = '${version}';\n`;

const text = fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8');
const json = JSON.parse(text);

fs.writeFileSync(path.join(__dirname, '../src/version.ts'), output(json.version), 'utf8');
