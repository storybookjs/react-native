// From: https://gist.github.com/ivanoats/8d01d9e934fdc17bae9090147f1e799b

const fs = require('fs');
const path = require('path');
const sm = require('sitemap');

function pagesToSitemap(pages) {
  return pages.filter(p => !!p.path).map(p => ({
    url: p.path,
    changefreq: 'daily',
    priority: 0.7,
  }));
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
  onPostBuild(pages, callback) {
    generateSitemap(pages);
    callback();
  },
  onCreateNode({ node, boundActionCreators, getNode }) {
    const { createNodeField } = boundActionCreators;
    let slug;
    if (node.internal.type === 'MarkdownRemark') {
      const fileNode = getNode(node.parent);
      const parsedFilePath = path.parse(fileNode.relativePath);
      if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
        slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
      } else if (parsedFilePath.dir === '') {
        slug = `/${parsedFilePath.name}/`;
      } else {
        slug = `/${parsedFilePath.dir}/`;
      }

      // Add slug as a field on the node.
      createNodeField({ node, name: 'slug', value: slug });
    }
  },
  createPages({ graphql, boundActionCreators }) {
    const { createPage } = boundActionCreators;

    return new Promise((resolve, reject) => {
      const template = path.resolve('src/templates/docs.js');
      // Query for all markdown "nodes" and for the slug we previously created.
      resolve(
        graphql(
          `
            {
              allMarkdownRemark {
                edges {
                  node {
                    fields {
                      slug
                    }
                  }
                }
              }
            }
          `
        ).then(result => {
          if (result.errors) {
            // eslint-disable-next-line no-console
            console.log(result.errors);
            reject(result.errors);
          }

          // Create pages.
          result.data.allMarkdownRemark.edges.forEach(edge => {
            createPage({
              path: edge.node.fields.slug, // required
              component: template,
              context: {
                slug: edge.node.fields.slug,
              },
            });
          });
        })
      );
    });
  },
};
