import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { config } from '../config.toml';

const Markdown = ({ route }) => {
  const post = route.page.data;
  const repoUrl = 'https://github.com/storybooks/storybook';
  const editUrl = `${repoUrl}/tree/master/docs/pages${route.path.replace(/\/$/g, '.md')}`;
  return (
    <DocumentTitle title={`${post.title} | ${config.siteTitle}`}>
      <div className="markdown">
        <h1>
          {post.title}
        </h1>
        <p>
          <a className="edit-link" href={editUrl} target="_blank" rel="noopener noreferrer">
            Edit this page
          </a>
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </DocumentTitle>
  );
};

Markdown.propTypes = {
  // eslint-disable-next-line
  route: PropTypes.object,
};

export default Markdown;
