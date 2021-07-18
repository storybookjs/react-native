import { View } from 'react-native';
import React from 'react';
import ModalPicker from 'react-native-modal-selector';
import styled from '@emotion/native';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderRadius: 2,
  padding: 5,
  margin: 10,
  borderColor: theme.borderColor || '#e6e6e6',
  color: theme.labelColor || 'black',
}));

export interface SelectProps {
  arg: {
    name: string;
    value: any;
    options: Array<any> | Record<string, any>;
    control: {
      labels?: Record<string, string>;
    };
  };
  onChange: (value: any) => void;
}

const getOptions = ({ options, control: { labels } }: SelectProps['arg']) => {
  if (Array.isArray(options)) {
    if (labels) {
      return options.map((val) => ({ key: val, label: labels[val] || val }));
    }
    return options.map((val) => ({ key: val, label: val }));
  }

  return Object.keys(options).map((key) => ({
    label: key,
    key: options[key],
  }));
};

const SelectType = ({ arg, onChange }: SelectProps) => {
  const { value } = arg;
  const options = getOptions(arg);

  const active = options.find(({ key }) => value === key);

  const selected = active && active.label;

  return (
    <View>
      <ModalPicker
        data={options}
        initValue={value}
        onChange={(option) => onChange(option.key)}
        animationType="none"
        keyExtractor={({ key, label }) => `${label}-${key}`}
      >
        <Input
          editable={false}
          value={selected}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
        />
      </ModalPicker>
    </View>
  );
};

SelectType.serialize = (value) => value;

SelectType.deserialize = (value) => value;

export default SelectType;
