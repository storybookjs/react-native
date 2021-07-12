import React from 'react';
import styled from '@emotion/native';

export interface TextProps {
  arg: {
    name: string;
    value: string;
    type: string;
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

const TextType = ({ arg, onChange }: TextProps) => {
  return (
    <Input
      testID={arg.name}
      defaultValue={arg.value}
      onChangeText={onChange}
      autoCapitalize="none"
      underlineColorAndroid="transparent"
    />
  );
};

TextType.defaultProps = {
  arg: {},
  onChange: (value) => value,
};

TextType.propTypes = {};

TextType.serialize = (value) => value;
TextType.deserialize = (value) => value;

export default TextType;
