import url from 'url';
import { version } from '../../package.json';

// assets.manager will be:
// - undefined
// - string e.g. 'static/manager.9adbb5ef965106be1cc3.bundle.js'
// - array of strings e.g.
// assets.manager will be something like:
// [ 'static/manager.c6e6350b6eb01fff8bad.bundle.js',
//   'static/manager.c6e6350b6eb01fff8bad.bundle.js.map' ]
const managerUrlsFromAssets = assets => {
  if (!assets || !assets.manager) {
    return {
      js: 'static/manager.bundle.js',
    };
  }

  if (typeof assets.manager === 'string') {
    return {
      js: assets.manager,
    };
  }

  return {
    js: assets.manager.find(filename => filename.match(/\.js$/)),
    css: assets.manager.find(filename => filename.match(/\.css$/)),
  };
};

export default function({ assets, publicPath, headHtml }) {
  const managerUrls = managerUrlsFromAssets(assets);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="storybook-version" content="${version}">
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <title>Storybook</title>
        <style>
          /*
            When resizing panels, the drag event breaks if the cursor
            moves over the iframe. Add the 'dragging' class to the body
            at drag start and remove it when the drag ends.
           */
          .dragging iframe {
            pointer-events: none;
          }

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
        ${headHtml}
      </head>
      <body style="margin: 0;">
        <div id="root"></div>
        <my-app></my-app>
        <script src="${url.resolve(publicPath, managerUrls.js)}"></script>
      </body>
    </html>
  `;
}
