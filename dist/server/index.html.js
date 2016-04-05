'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return '\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <title>React Storybook</title>\n        <script type="text/javascript">\n          window.dataId = \'' + _uuid2.default.v4() + '\';\n        </script>\n      </head>\n      <body style="margin: 0;">\n        <div id="root" />\n        <script src="/static/admin.bundle.js"></script>\n      </body>\n    </html>\n  ';
};

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }