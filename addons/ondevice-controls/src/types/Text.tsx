import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/native';

interface TextProps {
  knob: {
    name: string;
    value: string;
  };
  onChange: (value: any) => void;
}

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.borderColor || '#e6e6e6',
  borderRadius: 2,
  fontSize: 13,
  padding: 5,
  margin: 10,
  color: theme.labelColor || 'black',
}));

const TextType = ({ knob, onChange }) => (
  <Input
    testID={knob.name}
    value={knob.value}
    onChangeText={onChange}
    autoCapitalize="none"
    underlineColorAndroid="transparent"
  />
);

TextType.defaultProps = {
  knob: {},
  onChange: (value) => value,
};

TextType.propTypes = {};

TextType.serialize = (value) => value;
TextType.deserialize = (value) => value;

export default TextType;
