// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.
// Use `.scripts/user/pretest.js instead`.

require('babel-core/register');
require('babel-polyfill');

// Add jsdom support, which is required for enzyme.
var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];
var fileExts = ['jpg', 'png', 'gif', 'eot', 'svg', 'ttf', 'woff', 'woff2'];
var moduleExts = ['css', 'scss', 'sass'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

process.on('unhandledRejection', function (error) {
  console.error('Unhandled Promise Rejection:');
  console.error(error && error.stack || error);
});

fileExts.forEach(ext => {
 require.extensions[`.${ext}`] = function () {
   return '';
 };
});

moduleExts.forEach(ext => {
 require.extensions[`.${ext}`] = function () {
   return {};
 };
});

require('./user/pretest.js');
