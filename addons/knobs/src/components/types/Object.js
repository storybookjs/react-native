import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Textarea } from '@storybook/components';

class ObjectType extends Component {
  static getDerivedStateFromProps(props, state) {
    if (!state || props.knob.value !== state.value) {
      try {
        return { value: JSON.stringify(props.knob.value, null, 2), failed: false };
      } catch (e) {
        return { value: 'Object cannot be stringified', failed: true };
      }
    }
    return null;
  }

  handleChange = e => {
    const { value } = e.target;

    try {
      const json = JSON.parse(e.target.value.trim());
      this.setState({
        value,
        failed: false,
      });
      this.props.onChange(json);
    } catch (err) {
      this.setState({
        value,
        failed: true,
      });
    }
  };

  render() {
    const { value, failed } = this.state;

    return <Textarea error={failed} value={value} onChange={this.handleChange} size="flex" />;
  }
}

ObjectType.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

ObjectType.serialize = object => JSON.stringify(object);
ObjectType.deserialize = value => (value ? JSON.parse(value) : {});

export default ObjectType;
