"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (headHtml) {
  return "\n    <!DOCTYPE html>\n    <html>\n      <head>\n        <title>React Storybook</title>\n        " + headHtml + "\n      </head>\n      <body>\n        <div id=\"root\" />\n        <script src=\"/static/preview.bundle.js\"></script>\n      </body>\n    </html>\n  ";
};