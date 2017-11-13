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
    const domNode = ReactDOM.findDOMNode(this); // eslint-disable-line
    const nodes = domNode.querySelectorAll('pre code');

    nodes.forEach(node => {
      hljs.highlightBlock(node);
    });
  }

  render() {
    const { children } = this.props;
    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: children }} />;
  }
}

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Highlight;
