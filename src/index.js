import React from 'react';
import Remarkable from 'react-remarkable';
import '../vendor/modest.css';

export default class Story extends React.Component {
  static propTypes = {
    info: React.PropTypes.string,
  }

  stylesheet = {
    link: {
      base: {
        fontFamily: 'sans-serif',
        fontSize: 12,
        display: 'block',
        position: 'absolute',
        textDecoration: 'none',
        background: '#eee',
        color: '#333',
        padding: '5px 15px',
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

  openInfo() {
    this.setState({open: true});
  }

  closeInfo() {
    this.setState({open: false});
  }

  render() {
    const linkStyle = {
      ...this.stylesheet.link.base,
      ...this.stylesheet.link.topRight,
    }
    const infoStyle = Object.assign({}, this.stylesheet.info);
    if (!this.state.open) {
      infoStyle.display = 'none';
    }

    return (
      <div>
        {this.props.children}
        <a style={linkStyle} href='#' onClick={() => this.openInfo()}>more info</a>
        <div style={infoStyle}>
          <a style={linkStyle} href='#' onClick={() => this.closeInfo()}>×</a>
          <div className='storybook-story-info-page'>
            <div className='storybook-story-info-body'>
              <Remarkable source={this._deindent(this.props.info)}></Remarkable>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _deindent(input) {
    if (!input) {
      return '';
    }
    const lines = input.split('\n');
    while (lines[0].trim() === '') {
      lines.shift();
    }
    let padding = 0;
    const matches = lines[0].match(/^ */);
    if (matches) {
      padding = matches[0].length;
    }
    const trimmed = lines.map(s => s.slice(padding));
    return trimmed.join('\n');
  }
}
