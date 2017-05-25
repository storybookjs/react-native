import hljs from 'highlight.js';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

class Highlight extends React.Component {
  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    const domNode = ReactDOM.findDOMNode(this);
    const nodes = domNode.querySelectorAll('pre code');
    if (nodes.length > 0) {
      for (let i = 0; i < nodes.length; i++) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  }

  render() {
    const { children } = this.props;
    return <div dangerouslySetInnerHTML={{ __html: children }} />;
  }
}

Highlight.propTypes = {
  children: PropTypes.string,
};

export default Highlight;
