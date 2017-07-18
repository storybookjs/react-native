import React from 'react';
import PropTypes from 'prop-types';

import 'highlight.js/styles/github-gist.css';
import Highlight from '../../Highlight';
import './style.css';

const DocsContent = ({ title, content, editUrl }) =>
  <div id="docs-content">
    <div className="content">
      <h2 className="title">
        {title}
      </h2>
      <p>
        <a className="edit-link" href={editUrl} target="_blank" rel="noopener noreferrer">
          Edit this page
        </a>
      </p>
      <div className="markdown">
        <Highlight>
          {content}
        </Highlight>
      </div>
    </div>
  </div>;

DocsContent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  editUrl: PropTypes.string.isRequired,
};

export { DocsContent as default };
