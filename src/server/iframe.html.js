export default function (headHtml) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script>
          if (window.parent !== window) {
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
          }
        </script>
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
