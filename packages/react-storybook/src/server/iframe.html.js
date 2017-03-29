import url from 'url';

// assets.preview will be:
// - undefined
// - string e.g. 'static/preview.9adbb5ef965106be1cc3.bundle.js'
// - array of strings e.g.
// [ 'static/preview.9adbb5ef965106be1cc3.bundle.js',
//   'preview.0d2d3d845f78399fd6d5e859daa152a9.css',
//   'static/preview.9adbb5ef965106be1cc3.bundle.js.map',
//   'preview.0d2d3d845f78399fd6d5e859daa152a9.css.map' ]
const previewUrlsFromAssets = (assets) => {
  if (!assets) {
    return {
      js: 'static/preview.bundle.js',
    };
  }

  if (typeof assets.preview === 'string') {
    return {
      js: assets.preview,
    };
  }

  return {
    js: assets.preview.find(filename => filename.match(/\.js$/)),
    css: assets.preview.find(filename => filename.match(/\.css$/)),
  };
};

export default function (data) {
  const { assets, headHtml, publicPath } = data;

  const previewUrls = previewUrlsFromAssets(assets);

  let previewCssTag = '';
  if (previewUrls.css) {
    previewCssTag = `<link rel='stylesheet' type='text/css' href='${url.resolve(publicPath, previewUrls.css)}'>`;
  }

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
        ${previewCssTag}
      </head>
      <body>
        <div id="root"></div>
        <div id="error-display"></div>
        <script src="${url.resolve(publicPath, previewUrls.js)}"></script>
      </body>
    </html>
  `;
}
