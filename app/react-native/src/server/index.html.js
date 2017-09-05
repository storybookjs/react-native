import url from 'url';

export default function(publicPath, options) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Storybook for React</title>
        <style>
          /* Styling the fuzzy search box placeholders */
          .searchBox::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            color: #ddd;
            font-size: 16px;
          }

          .searchBox::-moz-placeholder { /* Firefox 19+ */
            color: #ddd;
            font-size: 16px;
          }

          .searchBox:focus{
            border-color: #EEE !important;
          }

          .btn:hover{
            background-color: #eee
          }
        </style>
      </head>
      <body style="margin: 0;">
        <div id="root"></div>
        <script>
          window.storybookOptions = ${JSON.stringify(options)};
        </script>
        <script src="${url.resolve(publicPath, 'static/manager.bundle.js')}"></script>
      </body>
    </html>
  `;
}
