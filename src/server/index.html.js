module.exports = function() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
    <title>React Storybook</title>
    </head>
    <body style="margin: 0;">
      <div id="root" />
      <script src="/static/bundle.js"></script>
    </body>
    </html>
  `;
};
