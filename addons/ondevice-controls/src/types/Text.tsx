import React from 'react';
import styled from '@emotion/native';
import { useResyncValue } from './useResyncValue';

export interface TextProps {
  arg: {
    name: string;
    value: string;
    type: string;
  };
  onChange: (value: any) => void;
  isPristine: boolean;
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

const TextType = ({ arg, onChange, isPristine }: TextProps) => {
  const { setCurrentValue, key } = useResyncValue(arg.value, isPristine);
  return (
    <Input
      key={key}
      testID={arg.name}
      defaultValue={arg.value}
      onChangeText={(text) => {
        onChange(text);
        setCurrentValue(text);
      }}
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
