import PropTypes from 'prop-types';
import React from 'react';
import Highlight from '../../Highlight';
import 'highlight.js/styles/github-gist.css';
import './style.css';

const DocsContent = ({ title, content, editUrl }) => (
  <div id="docs-content">
    <div className="content">
      <h2 className="title">{title}</h2>
      <p><a className="edit-link" href={editUrl} target="_blank">Edit this page</a></p>

      <div className="markdown">
        <Highlight>
          {content}
        </Highlight>
      </div>
    </div>
  </div>
);

DocsContent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
  editUrl: PropTypes.string,
};

export default DocsContent;
