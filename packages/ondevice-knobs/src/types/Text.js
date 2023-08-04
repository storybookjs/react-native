import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@storybook/react-native-theming';

import { inputStyle } from './common';

const Input = styled.TextInput(({ theme }) => ({
  ...inputStyle(theme),
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
  onChange: (value) => value,
};

TextType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

TextType.serialize = (value) => value;
TextType.deserialize = (value) => value;

export default TextType;
