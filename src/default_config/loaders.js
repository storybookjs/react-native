const fileExts = ['jpg', 'png', 'gif', 'eot', 'svg', 'ttf', 'woff', 'woff2', 'md', 'mdown', 'markdown'];
const moduleExts = ['css', 'scss', 'sass'];

const loaders = {};

fileExts.forEach((ext) => {
  loaders[ext] = filename => filename;
});

moduleExts.forEach((ext) => {
  loaders[ext] = () => null;
});

module.exports = loaders;
