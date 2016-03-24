'use strict';

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return '\n    <!DOCTYPE html>\n    <html>\n    <head>\n    <title>React Storybook</title>\n    </head>\n    <body>\n      <div id="root" />\n      <script src="/static/preview.bundle.js"></script>\n    </body>\n    </html>\n  ';
};