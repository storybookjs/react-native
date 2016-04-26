'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return '\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <title>React Storybook</title>\n        <script type="text/javascript">\n          window.dataId = \'' + _uuid2.default.v4() + '\';\n        </script>\n        <style>\n          /*\n            When resizing panels, the drag event breaks if the cursor\n            moves over the iframe. Add the \'dragging\' class to the body\n            at drag start and remove it when the drag ends.\n           */\n          .dragging iframe {\n            pointer-events: none;\n          }\n          \n          /* Styling the fuzzy search box placeholders */\n          .searchBox::-webkit-input-placeholder { /* Chrome/Opera/Safari */\n            color: #ddd;\n            font-size: 16px;\n          }\n          \n          .searchBox::-moz-placeholder { /* Firefox 19+ */\n            color: #ddd;\n            font-size: 16px;\n          }\n          \n          .searchBox:focus{\n            border-color: #EEE !important;\n          }\n          \n          .btn:hover{\n            background-color: #eee\n          }\n        </style>\n      </head>\n      <body style="margin: 0;">\n        <div id="root"></div>\n        <script src="static/admin.bundle.js"></script>\n      </body>\n    </html>\n  ';
};

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }