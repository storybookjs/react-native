import React, { Component } from 'react';
import PropTypes from 'prop-types';

// A small utility to add before/afterEach to stories.
class WithLifecyle extends Component {
  constructor(props, ...rest) {
    super(props, ...rest);

    props.beforeEach();
  }

  componentWillUnmount() {
    const { afterEach } = this.props;

    afterEach();
  }

  render() {
    const { storyFn } = this.props;

    return storyFn();
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
