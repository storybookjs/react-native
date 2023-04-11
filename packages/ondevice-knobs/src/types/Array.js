import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/native';

import { inputStyle } from './common';

const Input = styled.TextInput(({ theme }) => ({
  ...inputStyle(theme),
}));

function formatArray(value, separator) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

const ArrayType = ({ knob, onChange }) => (
  <Input
    id={knob.name}
    underlineColorAndroid="transparent"
    autoCapitalize="none"
    value={knob.value.join(knob.separator)}
    onChangeText={(e) => onChange(formatArray(e, knob.separator))}
  />
);

ArrayType.defaultProps = {
  knob: {},
  onChange: (value) => value,
};

ArrayType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.array,
    separator: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

ArrayType.serialize = (value) => value;
ArrayType.deserialize = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  return Object.keys(value)
    .sort()
    .reduce((array, key) => [...array, value[key]], []);
};

export default ArrayType;
