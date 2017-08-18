import url from 'url';

// assets.preview will be:
// - undefined
// - string e.g. 'static/preview.9adbb5ef965106be1cc3.bundle.js'
// - array of strings e.g.
// [ 'static/preview.9adbb5ef965106be1cc3.bundle.js',
//   'preview.0d2d3d845f78399fd6d5e859daa152a9.css',
//   'static/preview.9adbb5ef965106be1cc3.bundle.js.map',
//   'preview.0d2d3d845f78399fd6d5e859daa152a9.css.map' ]
const urlsFromAssets = assets => {
  if (!assets) {
    return {
      js: ['static/preview.bundle.js'],
      css: [],
    };
  }

  const urls = {
    js: [],
    css: [],
  };

  const re = /.+\.(\w+)$/;
  Object.keys(assets)
    // Don't load the manager script in the iframe
    .filter(key => key !== 'manager')
    .forEach(key => {
      const asset = assets[key];
      if (typeof asset === 'string') {
        urls[re.exec(asset)[1]].push(asset);
      } else {
        const assetUrl = asset.find(u => re.exec(u)[1] !== 'map');
        urls[re.exec(assetUrl)[1]].push(assetUrl);
      }
    });

  return urls;
};

export default function({ assets, publicPath, headHtml }) {
  const urls = urlsFromAssets(assets);

  const cssTags = urls.css
    .map(u => `<link rel='stylesheet' type='text/css' href='${url.resolve(publicPath, u)}'>`)
    .join('\n');
  const scriptTags = urls.js
    .map(u => `<script src="${url.resolve(publicPath, u)}"></script>`)
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <base target="_parent">
        <script>
          if (window.parent !== window) {
            window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__VUE_DEVTOOLS_GLOBAL_HOOK__;
            window.parent.__VUE_DEVTOOLS_CONTEXT__ = window.document;
          }
        </script>
        <title>Storybook</title>
        ${headHtml}
        ${cssTags}
      </head>
      <body>
        <div id="root"></div>
        <div id="error-display"></div>
        ${scriptTags}
      </body>
    </html>
  `;
}
