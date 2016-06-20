import React from 'react';
import MTRC from 'markdown-to-react-components';
import PropTable from './PropTable';
import Node from './Node';
import {H1, H2, H3, H4, H5, H6, Code, Pre, P, UL, A, LI} from './markdown';
import { baseFonts } from './theme';

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
  li: LI,
  ul: UL
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
      ...baseFonts,
      fontWeight: 300,
      maxWidth: '48rem',
      lineHeight: 1.45,
      fontSize: 15,
    },
    infoContent: {
      marginBottom: 0,
    },
    header: {
      h1: {
        margin: '20px 0 0 0',
        padding: 0,
        fontSize: 35,
      },
      h2: {
        margin: '0 0 10px 0',
        padding: 0,
        fontWeight: 400,
        fontSize: 22,
      },
      body: {
        borderBottom: '1px solid #eee',
      }
    },
    source: {
      h1: {
        margin: '20px 0 0 0',
        padding: '0 0 5px 0',
        fontSize: 30,
        borderBottom: '1px solid #EEE',
      }
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
    return (
      <div>
        { this.props.children }
        <div style={this.stylesheet.infoPage}>
          <div style={this.stylesheet.infoBody} >
            { this._getInfoHeader() }
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
      <div style={this.stylesheet.header.body}>
        <h1 style={this.stylesheet.header.h1}>{this.props.context.kind}</h1>
        <h2 style={this.stylesheet.header.h2}>{this.props.context.story}</h2>
      </div>
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
    return (
      <div style={this.stylesheet.infoContent}>
        {MTRC(source).tree}
      </div>
    );
  }

  _getSourceCode() {
    if (!this.props.showSource) {
      return null;
    }

    return (
      <div>
        <h1 style={this.stylesheet.source.h1}>Story Source</h1>
        <Pre>
        {React.Children.map(this.props.children, (root, idx) => (
          <Node key={idx} depth={0} node={root}></Node>
        ))}
        </Pre>
      </div>
    );
  }

  _getPropTables() {
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

    const propTables = array.map(function (type, idx) {
      return (
        <div key={idx}>
          <h2>{type.displayName || type.name}</h2>
          <PropTable type={type} />
        </div>
      );
    });

    if (!propTables || propTables.length === 0) {
      return null;
    }

    return (
      <div>
        <h1 style={this.stylesheet.source.h1}>Prop Types</h1>
        {propTables}
      </div>
    );
    return ;
  }
}
