import { getOptions } from 'loader-utils';
import injectDecorator from './inject-decorator';

const ADD_DECORATOR_STATEMENT = '.addDecorator(withStorySource(__STORY__, __ADDS_MAP__))';

function transform(source) {
  const options = getOptions(this) || {};
  const result = injectDecorator(source, ADD_DECORATOR_STATEMENT, this.resourcePath, options);

  if (!result.changed) {
    return source;
  }

  const sourceJson = JSON.stringify(result.storySource)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const addsMap = JSON.stringify(result.addsMap);

  return `
  export var withStorySource = require('@storybook/addon-storysource').withStorySource;
  export var __STORY__ = ${sourceJson};
  export var __ADDS_MAP__ = ${addsMap};
  
  ${result.source}
  `;
}

export default transform;
