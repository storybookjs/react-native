const STORY_OF_STATEMENT = 'storiesOf(';
const ADD_STATEMENT = 'add';
const ADD_DECORATOR_STATEMENT = 'addDecorator(withStorySource(__STORY__)).';
const ADD_DECORATOR_STATEMENT_LENGTH = ADD_DECORATOR_STATEMENT.length;

function insertDecorator(source) {
  let newSource = source;
  let changed = false;
  let storyOfIndex = source.indexOf(STORY_OF_STATEMENT);

  while (storyOfIndex > 0) {
    const indexOfFirstAdd = newSource.indexOf(ADD_STATEMENT, storyOfIndex);

    const start = newSource.slice(0, indexOfFirstAdd);
    const end = newSource.slice(indexOfFirstAdd);

    newSource = `${start}${ADD_DECORATOR_STATEMENT}${end}`;

    storyOfIndex = newSource.indexOf(
      STORY_OF_STATEMENT,
      indexOfFirstAdd + ADD_DECORATOR_STATEMENT_LENGTH
    );

    changed = true;
  }

  return {
    newSource,
    changed,
  };
}

module.exports = source => {
  this.value = source;

  // Based on https://github.com/webpack-contrib/raw-loader/blob/master/index.js
  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const result = insertDecorator(source);

  if (!result.changed) {
    return source;
  }

  return `
  var withStorySource = require('@storybook/addon-stories').withStorySource;
  var __STORY__ = ${json};
  
  ${result.newSource}
  `;
};
