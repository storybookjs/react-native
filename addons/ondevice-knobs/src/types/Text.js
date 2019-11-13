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

const TextType = ({ knob, onChange }) => (
  <Input
    id={knob.name}
    value={knob.value}
    onChangeText={onChange}
    autoCapitalize="none"
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
