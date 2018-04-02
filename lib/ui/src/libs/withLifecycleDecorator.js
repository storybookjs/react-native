import React, { Component } from 'react';
import PropTypes from 'prop-types';

// A small utility to add before/afterEach to stories.
class WithLifecyle extends Component {
  constructor(props, ...rest) {
    super(props, ...rest);

    props.beforeEach();
  }

  componentWillUnmount() {
    this.props.afterEach();
  }

  render() {
    return this.props.storyFn();
  }
}

WithLifecyle.propTypes = {
  storyFn: PropTypes.func.isRequired,
  beforeEach: PropTypes.func,
  afterEach: PropTypes.func,
};
WithLifecyle.defaultProps = {
  beforeEach: () => {},
  afterEach: () => {},
};

export default ({ beforeEach, afterEach }) => storyFn => (
  <WithLifecyle beforeEach={beforeEach} afterEach={afterEach} storyFn={storyFn} />
);
