// see also: https://github.com/gatsbyjs/gatsby-starter-kitchen-sink/blob/master/loaders/markdown-loader/index.js

const frontMatter = require('front-matter');
const markdownIt = require('markdown-it');
const hljs = require('highlight.js');
const objectAssign = require('object-assign');
const path = require('path');
const loaderUtils = require('loader-utils');

const highlight = (str, lang) => {
  if (lang !== null && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value;
    } catch (_error) {
      console.error(_error);
    }
  }
  try {
    return hljs.highlightAuto(str).value;
  } catch (_error) {
    console.error(_error);
  }
  return '';
};

const md = (linkPrefix, shouldPrefix) =>
  markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight,
    replaceLink: link => {
      if (shouldPrefix && path.isAbsolute(link)) {
        return linkPrefix + link;
      }
      return link;
    },
  })
    .use(require('markdown-it-replace-link'))
    .use(require('markdown-it-anchor'), {
      permalink: true,
      permalinkSymbol: '🔗',
    });

module.exports = function(content) {
  this.cacheable();

  const query = loaderUtils.parseQuery(this.query);
  const linkPrefix = query.config.linkPrefix || '';
  const shouldPrefix = query.shouldPrefix;

  const meta = frontMatter(content);
  const body = md(linkPrefix, shouldPrefix).render(meta.body);
  const result = objectAssign({}, meta.attributes, {
    body,
  });
  this.value = result;
  return `module.exports = ${JSON.stringify(result)}`;
};
