import UUID from 'uuid';

module.exports = function() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
    <title>React Storybook</title>
    <script type="text/javascript">
      window.dataId = '${UUID.v4()}';
    </script>
    </head>
    <body style="margin: 0;">
      <div id="root" />
      <script src="/static/admin.bundle.js"></script>
    </body>
    </html>
  `;
};
