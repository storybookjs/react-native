/*
 * By the time this file was added the repository for angular2-template-loader received no updates in 3 years
 * This is just a copy of https://github.com/TheLarkInn/angular2-template-loader/blob/master/index.js in order
 * to fix a bug that prevents Storybook from updating raw-loader > ^1.0.0
 *
 * As suggested in https://github.com/storybookjs/storybook/issues/7877#issuecomment-536556755 this code was
 * modified to be compatible with newer versions of raw-loader as well as backwards compatible with raw-loader ^1.0.0
 */

// eslint-disable-next-line import/no-extraneous-dependencies
// const loaderUtils = require('loader-utils');

// using: regex, capture groups, and capture group variables.
const templateUrlRegex = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*([,}]))/gm;
const stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
const stringRegex = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string: string) {
  // eslint-disable-next-line func-names
  return string.replace(stringRegex, function(match, quote, url) {
    if (url.charAt(0) !== '.') {
      // eslint-disable-next-line no-param-reassign
      url = `./${url}`;
    }
    return `(require('${url}').default || require('${url}'))`;
  });
}

// eslint-disable-next-line consistent-return,func-names
export default function(source: any, sourcemap: any) {
  const config: any = {};
  // const query = loaderUtils.parseQuery(this.query);
  let styleProperty = 'styles';
  let templateProperty = 'template';

  if (this.options != null) {
    Object.assign(config, this.options.angular2TemplateLoader);
  }

  // Object.assign(config, query);

  if (config.keepUrl === true) {
    styleProperty = 'styleUrls';
    templateProperty = 'templateUrl';
  }

  // Not cacheable during unit tests;
  // eslint-disable-next-line no-unused-expressions
  this.cacheable && this.cacheable();

  const newSource = source
    // eslint-disable-next-line func-names
    .replace(templateUrlRegex, function(match: any, url: any) {
      // replace: templateUrl: './path/to/template.html'
      // with: template: require('./path/to/template.html')
      // or: templateUrl: require('./path/to/template.html')
      // if `keepUrl` query parameter is set to true.
      return `${templateProperty}:${replaceStringsWithRequires(url)}`;
    })
    // eslint-disable-next-line func-names
    .replace(stylesRegex, function(match: any, urls: any) {
      // replace: stylesUrl: ['./foo.css', "./baz.css", "./index.component.css"]
      // with: styles: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
      // or: styleUrls: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
      // if `keepUrl` query parameter is set to true.
      return `${styleProperty}:${replaceStringsWithRequires(urls)}`;
    });

  // Support for tests
  if (this.callback) {
    this.callback(null, newSource, sourcemap);
  } else {
    return newSource;
  }
}
