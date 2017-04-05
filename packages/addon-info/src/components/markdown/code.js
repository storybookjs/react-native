import React from 'react';

export class Code extends React.Component {

  componentDidMount() {
    this.highlight()
  }

  componentDidUpdate() {
    this.highlight()
  }

  highlight() {
    if (typeof Prism !== 'undefined') {
      Prism.highlightAll()
    }
  }

  render() {
    const codeStyle = {
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      backgroundColor: '#fafafa',
    };

    const preStyle = {
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      backgroundColor: '#fafafa',
      padding: '.5rem',
      lineHeight: 1.5,
      overflowX: 'scroll',
    };

    const className = this.props.language ? `language-${this.props.language}` : '';

    return (
      <pre style={preStyle} className={className}>
        <code style={codeStyle} className={className}>
          { this.props.code }
        </code>
      </pre>
    );
  }
}

export class Pre extends React.Component {
  render() {
    const style = {
      fontSize: '.88em',
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      backgroundColor: '#fafafa',
      padding: '.5rem',
      lineHeight: 1.5,
      overflowX: 'scroll',
    };

    return <pre style={style}>{this.props.children}</pre>;
  }
}

export class Blockquote extends React.Component {
  render() {
    const style = {
      fontSize: '1.88em',
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      borderLeft: '8px solid #fafafa',
      padding: '1rem',
    };

    return <blockquote style={style}>{this.props.children}</blockquote>;
  }
}
