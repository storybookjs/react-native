import React from 'react';
import PropTypes from 'prop-types';

import ToggleButton from './toggleButton';
import copy from './copy';

const TOGGLE_TIMEOUT = 1800;

export class Pre extends React.Component {
  state = {
    copied: false,
  };

  setRef = elem => {
    this.pre = elem;
  };

  handleClick = () => {
    const text = this.pre && this.pre.innerText;

    if (!text) {
      return;
    }

    copy(text);
    this.setState({ copied: true });

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.setState({ copied: false });
    }, TOGGLE_TIMEOUT);
  };

  render() {
    const preStyle = {
      fontSize: '.88em',
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      backgroundColor: '#fafafa',
      padding: '.5rem',
      lineHeight: 1.5,
      overflowX: 'scroll',
    };

    const wrapperStyle = {
      position: 'relative',
    };

    const buttonWrapperStyle = {
      position: 'absolute',
      right: 10,
      top: 10,
    };

    return (
      <div style={wrapperStyle}>
        <div style={buttonWrapperStyle}>
          <ToggleButton onClick={this.handleClick} toggled={this.state.copied} />
        </div>
        <pre style={preStyle} ref={this.setRef}>
          {this.props.children}
        </pre>
      </div>
    );
  }
}

Pre.propTypes = { children: PropTypes.node };
Pre.defaultProps = { children: null };
