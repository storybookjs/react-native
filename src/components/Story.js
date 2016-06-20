import React from 'react';
import MTRC from 'markdown-to-react-components';
import PropTable from './PropTable';
import Node from './Node';
import {H1, H2, H3, H4, H5, H6, Code, Pre, P, Small, A} from './markdown'

MTRC.configure({
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  code: Code,
  pre: Pre,
  p: P,
  a: A,
});

export default class Story extends React.Component {
  static displayName = 'Story';
  static propTypes = {
    context: React.PropTypes.object,
    info: React.PropTypes.string,
    propTables: React.PropTypes.arrayOf(React.PropTypes.func),
    showInline: React.PropTypes.bool,
    showHeader: React.PropTypes.bool,
    showSource: React.PropTypes.bool,
  }
  static defaultProps = {
    showInline: false,
    showHeader: true,
    showSource: true,
  }

  stylesheet = {
    link: {
      base: {
        fontFamily: 'sans-serif',
        fontSize: 12,
        display: 'block',
        position: 'fixed',
        textDecoration: 'none',
        background: '#28c',
        color: '#fff',
        padding: '5px 15px',
        cursor: 'pointer',
      },
      topRight: {
        top: 0,
        right: 0,
        borderRadius: '0 0 0 5px',
      },
    },
    info: {
      position: 'absolute',
      background: 'white',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      padding: '0 40px',
      overflow: 'auto',
    },
    infoBody: {
      fontSize: "16px",
    },
    infoBody: {
      color: '#444',
      fontFamily: "'Open Sans Condensed', sans-serif",
      fontWeight: 300,
      margin: '0 auto',
      maxWidth: '48rem',
      lineHeight: 1.45,
      padding: '.25rem',
    }
  }

  constructor(...args) {
    super(...args);
    this.state = {open: false};
  }

  render() {
    if (this.props.showInline) {
      return this._renderInline();
    }
    return this._renderOverlay();
  }

  _renderInline() {
    const infoBodyInlineStyle = {
      borderTop: 'solid 1px #fafafa',
      marginTop: '1.5em',
    }
    const infoBodyStyle = Object.assign(this.stylesheet.infoBody, infoBodyInlineStyle);

    return (
      <div>
        { this.props.children }
        <div style={this.stylesheet.infoPage}>
          <div style={infoBodyStyle} >
            { this._getInfoContent() }
            { this._getSourceCode() }
            { this._getPropTables() }
          </div>
        </div>
      </div>
    );
  }

  _renderOverlay() {
    const linkStyle = {
      ...this.stylesheet.link.base,
      ...this.stylesheet.link.topRight,
    }
    const infoStyle = Object.assign({}, this.stylesheet.info);
    if (!this.state.open) {
      infoStyle.display = 'none';
    }

    const openOverlay = () => {
      this.setState({open: true});
      return false;
    }

    const closeOverlay = () => {
      this.setState({open: false});
      return false;
    }

    return (
      <div>
        { this.props.children }
        <a style={linkStyle} onClick={openOverlay}>?</a>
        <div style={infoStyle}>
          <a style={linkStyle} onClick={closeOverlay}>×</a>
          <div style={this.stylesheet.infoPage}>
            <div style={this.stylesheet.infoBody}>
              { this._getInfoHeader() }
              { this._getInfoContent() }
              { this._getSourceCode() }
              { this._getPropTables() }
            </div>
          </div>
        </div>
      </div>
    );
  }

  _getInfoHeader() {
    if (!this.props.context || !this.props.showHeader) {
      return null;
    }

    return (
      <header>
        <h1>{this.props.context.kind}</h1>
        <h2>{this.props.context.story}</h2>
      </header>
    );
  }

  _getInfoContent() {
    if (!this.props.info) {
      return '';
    }
    const lines = this.props.info.split('\n');
    while (lines[0].trim() === '') {
      lines.shift();
    }
    let padding = 0;
    const matches = lines[0].match(/^ */);
    if (matches) {
      padding = matches[0].length;
    }
    const source = lines.map(s => s.slice(padding)).join('\n');
    return MTRC(source).tree;
  }

  _getSourceCode() {
    if (!this.props.showSource) {
      return null;
    }

    return (
      <div>
        <H3>Example Source</H3>
        <Pre>
        {React.Children.map(this.props.children, (root, idx) => (
          <Node key={idx} depth={0} node={root}></Node>
        ))}
        </Pre>
      </div>
    );
  }

  _getPropTables() {
    debugger;
    if (!this.props.children && !this.props.propTables) {
      return null;
    }

    const types = new Map();

    if (this.props.propTables) {
      this.props.propTables.forEach(function (type) {
        types.set(type, true);
      });
    }

    function extract(children) {
      if (Array.isArray(children)) {
        children.forEach(extract);
        return;
      }
      if (typeof children === 'string' || typeof children.type === 'string') {
        return;
      }

      const type = children.type;
      const name = type.displayName || type.name;
      if (!types.has(type)) {
        types.set(type, true);
      }
      if (children.props.children) {
        extract(children.props.children);
      }
    }

    // extract components from children
    extract(this.props.children);

    const array = Array.from(types.keys());
    array.sort(function (a, b) {
      return (a.displayName || a.name) > (b.displayName || b.name);
    });

    return array.map(function (type, idx) {
      return (
        <div key={idx}>
          <h3>&lt;{type.displayName || type.name} /&gt; PropTypes</h3>
          <PropTable type={type} />
        </div>
      );
    });
  }
}
