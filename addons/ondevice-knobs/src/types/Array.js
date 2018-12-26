import PropTypes from 'prop-types';
import React from 'react';

import { TextInput } from 'react-native';

function formatArray(value, separator) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

const ArrayType = ({ knob, onChange }) => (
  <TextInput
    id={knob.name}
    underlineColorAndroid="transparent"
    style={{
      borderWidth: 1,
      borderColor: '#f7f4f4',
      borderRadius: 2,
      fontSize: 13,
      padding: 5,
      margin: 10,
      color: '#555',
    }}
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
