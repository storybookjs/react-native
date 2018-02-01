import injectDecorator from './inject-decorator';

function transform(source) {
  // Based on https://github.com/webpack-contrib/raw-loader/blob/master/index.js
  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const result = injectDecorator(source);

  if (!result.changed) {
    return source;
  }

  return `
  var withStorySource = require('@storybook/addon-stories').withStorySource;
  var __STORY__ = ${json};
  
  ${result.source}
  `;
}

export default transform;
