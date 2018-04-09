import PropTypes from 'prop-types';
import React from 'react';
import { polyfill } from 'react-lifecycles-compat';

import { baseFonts } from '@storybook/components';

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
      ...props,
      isVisible: false,
    };

    this.hideTimeout = null;
  }

  componentDidUpdate() {
    if (this.state.isVisible) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(() => {
        this.setState({ isVisible: false });
      }, DISPLAY_TIMEOUT);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
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

Dimensions.getDerivedStateFromProps = (nextProps, prevState) => {
  if (nextProps.width !== prevState.width || nextProps.height !== prevState.height) {
    return { ...nextProps, isVisible: true };
  }
  return null;
};

Dimensions.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

polyfill(Dimensions);

export default Dimensions;
