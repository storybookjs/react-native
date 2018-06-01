import React, { Component } from 'react';
import PropTypes from 'prop-types';
import equal from 'fast-deep-equal';
import { Textarea } from '@storybook/components';

class ObjectType extends Component {
  static getDerivedStateFromProps(props, state) {
    if (!state || !equal(props.knob.value, state.json)) {
      try {
        return {
          value: JSON.stringify(props.knob.value, null, 2),
          failed: false,
          json: props.knob.value,
        };
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
        json,
        failed: false,
      });
      if (equal(this.props.knob.value, this.state.json)) {
        this.props.onChange(json);
      }
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
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

ObjectType.serialize = object => JSON.stringify(object);
ObjectType.deserialize = value => (value ? JSON.parse(value) : {});

export default ObjectType;
