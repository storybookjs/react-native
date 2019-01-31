import PropTypes from 'prop-types';
import React from 'react';

import { Form } from '@storybook/components';

function formatArray(value, separator) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

class ArrayType extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { knob } = this.props;

    return nextProps.knob.value !== knob.value;
  }

  handleChange = e => {
    const { knob, onChange } = this.props;
    const { value } = e.target;
    const newVal = formatArray(value, knob.separator);

    onChange(newVal);
  };

  render() {
    const { knob } = this.props;
    const value = knob.value.join(knob.separator);

    return (
      <Form.Textarea
        id={knob.name}
        name={knob.name}
        value={value}
        onChange={this.handleChange}
        size="flex"
      />
    );
  }
}

ArrayType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ArrayType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.array,
    separator: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

ArrayType.serialize = value => value;
ArrayType.deserialize = value => {
  if (Array.isArray(value)) return value;

  return Object.keys(value)
    .sort()
    .reduce((array, key) => [...array, value[key]], []);
};

export default ArrayType;
