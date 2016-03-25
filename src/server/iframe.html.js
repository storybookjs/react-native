import UUID from 'uuid';

module.exports = function () {
  return `
    <!DOCTYPE html>
    <html>
    <head>
    <title>React Storybook</title>
    </head>
    <body>
      <div id="root" />
      <script src="/static/preview.bundle.js"></script>
    </body>
    </html>
  `;
};
