// see also: https://github.com/gatsbyjs/gatsby-starter-kitchen-sink/blob/master/loaders/markdown-loader/index.js

const frontMatter = require('front-matter');
const markdownIt = require('markdown-it');
const hljs = require('highlight.js');
const path = require('path');
const loaderUtils = require('loader-utils');

const logger = console;

const highlight = (str, lang) => {
  if (lang !== null && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value;
    } catch (error) {
      logger.error(error);
    }
  }
  try {
    return hljs.highlightAuto(str).value;
  } catch (error) {
    logger.error(error);
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
    .use(require('markdown-it-replace-link')) // eslint-disable-line
    .use(require('markdown-it-anchor'), { // eslint-disable-line
      permalink: true,
      permalinkSymbol: '⚓️',
    });

module.exports = function markdownLoader(content) {
  this.cacheable();

  const query = loaderUtils.parseQuery(this.query);
  const linkPrefix = query.config.linkPrefix || '';
  const shouldPrefix = query.shouldPrefix;

  const meta = frontMatter(content);
  const body = md(linkPrefix, shouldPrefix).render(meta.body);
  const result = Object.assign({}, meta.attributes, {
    body,
  });
  this.value = result;
  return `module.exports = ${JSON.stringify(result)}`;
};
