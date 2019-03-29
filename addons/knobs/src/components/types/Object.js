import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deepEqual from 'fast-deep-equal';
import { polyfill } from 'react-lifecycles-compat';
import { Form } from '@storybook/components';

class ObjectType extends Component {
  state = {
    value: {},
    failed: false,
    json: '',
  };

  static getDerivedStateFromProps(props, state) {
    if (!deepEqual(props.knob.value, state.json)) {
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
    const { json: stateJson } = this.state;
    const { knob, onChange } = this.props;

    try {
      const json = JSON.parse(value.trim());
      this.setState({
        value,
        json,
        failed: false,
      });
      if (deepEqual(knob.value, stateJson)) {
        onChange(json);
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
    const { knob } = this.props;

    return (
      <Form.Textarea
        name={knob.name}
        valid={failed ? 'error' : null}
        value={value}
        onChange={this.handleChange}
        size="flex"
      />
    );
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

polyfill(ObjectType);

export default ObjectType;
