import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { config } from 'config';

const Markdown = ({ route }) => {
  const post = route.page.data;
  const repoUrl = 'https://github.com/storybooks/storybooks.github.io';
  const editUrl = `{repoUrl}/tree/source/pages${route.path.replace(/\/$/g, '.md')}`;
  return (
    <DocumentTitle title={`${post.title} | ${config.siteTitle}`}>
      <div className="markdown">
        <h1>{post.title}</h1>
        <p>
          <a className="edit-link" href={editUrl} target="_blank">
            Edit this page
          </a>
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </DocumentTitle>
  );
};

Markdown.propTypes = {
  route: PropTypes.object,
};

export default Markdown;
