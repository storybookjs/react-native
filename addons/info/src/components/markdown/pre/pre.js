import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import CopyButton from './copyButton';
import copy from './copy';

const TOGGLE_TIMEOUT = 1800;

const StyledPre = styled('pre')(
  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '.88em',
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    backgroundColor: '#fafafa',
    padding: '.5rem',
    lineHeight: 1.5,
    overflowX: 'scroll',
  },
  ({ styles }) => styles
);

class Pre extends React.Component {
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
    const { theme, children } = this.props;
    const { pre } = theme;
    const { copied } = this.state;

    return (
      <StyledPre styles={pre}>
        <div ref={this.setRef}>{children}</div>
        <CopyButton onClick={this.handleClick} toggled={copied} />
      </StyledPre>
    );
  }
}

Pre.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.shape({
    pre: PropTypes.object,
  }),
};

Pre.defaultProps = {
  children: null,
  theme: {},
};

export default Pre;
