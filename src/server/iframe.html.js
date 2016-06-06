import path from 'path';

export default function (headHtml, publicPath) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
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
        <script src="${path.join(publicPath, 'preview.bundle.js')}"></script>
      </body>
    </html>
  `;
}
