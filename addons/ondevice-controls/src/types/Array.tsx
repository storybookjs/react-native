import React from 'react';
import styled from '@emotion/native';

import { inputStyle } from './common';
import { useResyncValue } from './useResyncValue';

const Input = styled.TextInput(({ theme }) => ({
  ...inputStyle(theme),
}));

function formatArray(value: string, separator: string) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

export interface ArrayProps {
  arg: {
    name: string;
    value: string[];
    separator: string;
  };
  onChange: (value: string[]) => void;
  isPristine: boolean;
}

const ArrayType = ({
  arg: { name, value, separator = ',' },
  onChange = () => null,
  isPristine,
}: ArrayProps) => {
  const { setCurrentValue, key } = useResyncValue(value, isPristine);
  return (
    <Input
      key={key}
      testID={name}
      underlineColorAndroid="transparent"
      autoCapitalize="none"
      defaultValue={value.join(separator)}
      onChangeText={(text) => {
        const formatted = formatArray(text, separator);
        onChange(formatted);
        setCurrentValue(formatted);
      }}
    />
  );
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
