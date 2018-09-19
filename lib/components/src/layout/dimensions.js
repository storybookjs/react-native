import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styled from '@emotion/styled';

const DISPLAY_TIMEOUT = 1000;

const Container = styled.div({
  position: 'absolute',
  padding: '5px 8px',
  bottom: 0,
  right: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  borderRadius: '5px 0 0 0',
});

const Section = styled.span({ fontSize: 12 });

const Delimiter = styled.span({
  margin: '0px 5px',
  fontSize: 12,
});

class Dimensions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      isVisible: false,
    };

    this.hideTimeout = null;
  }

  componentDidUpdate() {
    const { isVisible } = this.state;

    if (isVisible) {
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
    const { isVisible } = this.state;
    const { width, height } = this.props;

    return isVisible ? (
      <Container>
        <Section>{`${width}px`}</Section>
        <Delimiter>x</Delimiter>
        <Section>{`${height}px`}</Section>
      </Container>
    ) : null;
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

export default Dimensions;
