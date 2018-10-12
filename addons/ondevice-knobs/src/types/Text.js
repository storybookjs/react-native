import PropTypes from 'prop-types';
import React from 'react';
import { TextInput } from 'react-native';

const TextType = ({ knob, onChange }) => (
  <TextInput
    style={{
      borderWidth: 1,
      borderColor: '#f7f4f4',
      borderRadius: 2,
      fontSize: 13,
      padding: 5,
      margin: 10,
      color: '#555',
    }}
    id={knob.name}
    value={knob.value}
    onChangeText={onChange}
    underlineColorAndroid="transparent"
  />
);

TextType.defaultProps = {
  knob: {},
  onChange: value => value,
};

TextType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

TextType.serialize = value => value;
TextType.deserialize = value => value;

export default TextType;
