export default function (extraHtml) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>React Storybook</title>
        ${extraHtml}
      </head>
      <body>
        <div id="root" />
        <script src="/static/preview.bundle.js"></script>
      </body>
    </html>
  `;
}
