export default function (headHtml) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
          if (window.parent !== window) {
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
          }
        </script>
        <title>React Storybook</title>
        ${headHtml}
      </head>
      <body>
        <div id="root"></div>
        <script src="static/preview.bundle.js"></script>
      </body>
    </html>
  `;
}
