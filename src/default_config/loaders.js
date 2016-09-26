const fileExts = ['jpg', 'png', 'gif', 'eot', 'svg', 'ttf', 'woff', 'woff2'];
const moduleExts = ['css', 'scss', 'sass'];

const loaders = {};

fileExts.forEach((ext) => {
  loaders[ext] = filename => filename;
});

moduleExts.forEach((ext) => {
  loaders[ext] = () => null;
});

module.exports = loaders;
