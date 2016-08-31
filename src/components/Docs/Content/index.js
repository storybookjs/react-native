import React from 'react';
import Highlight from 'react-highlight';
import marked from 'marked';
import 'highlight.js/styles/github-gist.css';
import './style.css';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

const DocsContent = ({ title, content }) => (
  <div id="docs-content">
    <div className="content">
      <h2 className="title">{ title }</h2>
      <div className="markdown">
        <Highlight innerHTML={true}>
        { marked(content) }
        </Highlight>
      </div>
    </div>
  </div>
);

DocsContent.propTypes = {
  title: React.PropTypes.string,
  content: React.PropTypes.string.isRequired,
};

export default DocsContent;
