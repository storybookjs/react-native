import React from 'react';
import styled from '@emotion/native';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.borderColor || '#e6e6e6',
  borderRadius: 2,
  fontSize: 13,
  padding: 5,
  margin: 10,
  color: theme.labelColor || 'black',
}));

function formatArray(value: string, separator: string) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

export interface ArrayProps {
  knob: {
    name: string;
    value: string[];
    separator: string;
  };
  onChange: (value: string[]) => void;
}

const ArrayType = ({ knob, onChange = () => null }: ArrayProps) => (
  <Input
    testID={knob.name}
    underlineColorAndroid="transparent"
    autoCapitalize="none"
    value={knob.value.join(knob.separator)}
    onChangeText={(e) => onChange(formatArray(e, knob.separator))}
  />
);

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
