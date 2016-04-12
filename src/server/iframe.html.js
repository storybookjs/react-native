export default function (headHtml) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>React Storybook</title>
        ${headHtml}
      </head>
      <body>
        <div id="root" />
        <script src="static/preview.bundle.js"></script>
      </body>
    </html>
  `;
}
