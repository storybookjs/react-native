import PropTypes from 'prop-types';
import React from 'react';

import { baseFonts } from '../theme';

const container = {
  position: 'absolute',
  padding: 5,
  bottom: 10,
  right: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
};

const dimensionStyle = {
  fontSize: 12,
  ...baseFonts,
};

const delimeterStyle = {
  margin: '0px 5px',
  fontSize: 12,
  ...baseFonts,
};

// Same as Chrome's timeout in the developer tools
const DISPLAY_TIMEOUT = 1000;

class Dimensions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
    };

    this.hideTimeout = null;
  }

  componentWillReceiveProps({ width, height }) {
    if (width !== this.state.width || height !== this.state.height) {
      this.onChange(width, height);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  onChange(width, height) {
    this.setState({ isVisible: true });

    this.hideTimeout = setTimeout(() => {
      // Ensure the dimensions aren't still changing
      if (width === this.props.width && height === this.props.height) {
        this.setState({ isVisible: false });
      }
    }, DISPLAY_TIMEOUT);
  }

  render() {
    if (!this.state.isVisible) {
      return null;
    }

    const { width, height } = this.props;

    return (
      <div style={container}>
        <span style={dimensionStyle}>{`${width}px`}</span>
        <span style={delimeterStyle}>x</span>
        <span style={dimensionStyle}>{`${height}px`}</span>
      </div>
    );
  }
}

Dimensions.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Dimensions;
