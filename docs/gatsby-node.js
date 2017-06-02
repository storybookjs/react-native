// From: https://gist.github.com/ivanoats/8d01d9e934fdc17bae9090147f1e799b

const fs = require('fs');
const sm = require('sitemap');

function pagesToSitemap(pages) {
  const urls = pages.map(p => {
    if (p.path !== undefined) {
      return {
        url: p.path,
        changefreq: 'daily',
        priority: 0.7,
      };
    }
  });
  return urls.filter(u => u !== undefined);
}

function generateSitemap(pages) {
  const sitemap = sm.createSitemap({
    hostname: 'https://storybook.js.org',
    cacheTime: '60000',
    urls: pagesToSitemap(pages),
  });
  fs.writeFileSync(`${__dirname}/public/sitemap.xml`, sitemap.toString());
}

module.exports = {
  postBuild(pages, callback) {
    generateSitemap(pages);
    callback();
  },
};
