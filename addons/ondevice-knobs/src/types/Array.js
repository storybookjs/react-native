import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/native';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.borderColor,
  borderRadius: 2,
  fontSize: 13,
  padding: 5,
  margin: 10,
  color: theme.labelColor,
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
    onChangeText={e => onChange(formatArray(e, knob.separator))}
  />
);

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
