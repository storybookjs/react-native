import React from 'react';
import Remarkable from 'react-remarkable';
import PropTable from './PropTable';
import Node from './Node.js';

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
        position: 'absolute',
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
        <div className='storybook-story-info-page'>
          <div className='storybook-story-info-body storybook-story-info-body-inline'>
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
          <div className='storybook-story-info-page'>
            <div className='storybook-story-info-body'>
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
    return <Remarkable source={source}></Remarkable>;
  }

  _getSourceCode() {
    if (!this.props.showSource) {
      return null;
    }

    return (
      <div>
        <h3>Example Source</h3>
        <pre>
        {React.Children.map(this.props.children, root => (
          <Node depth={0} node={root}></Node>
        ))}
        </pre>
      </div>
    );
  }

  _getPropTables() {
    if (!this.props.propTables) {
      return null;
    }

    return this.props.propTables.map(comp => (
      <div>
        <h3>{comp.displayName || comp.name} PropTypes</h3>
        <PropTable comp={comp} />
      </div>
    ));
  }
}
