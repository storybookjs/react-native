import { Platform, View } from 'react-native';
import React from 'react';
import ModalPicker from 'react-native-modal-selector';
import styled from '@emotion/native';

import { inputStyle } from './common';

const Input = styled.TextInput(({ theme }) => ({
  ...inputStyle(theme),
}));

const Select = (args: any) => <select {...args} />;
const Container = styled.View(({ theme }) => ({
  backgroundColor: theme.inputs.text.backgroundColor,
  borderRadius: theme.inputs.text.borderRadius,
  paddingHorizontal: theme.inputs.text.paddingHorizontal,
  paddingVertical: theme.inputs.text.paddingVertical,
}));

const WebSelect = styled(Select)(({ theme }) => ({
  border: 'none',
  color: theme.inputs.labelTextColor,
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

  if (Platform.OS === 'web') {
    const handleChange = (event) => {
      onChange(event.target.value);
    };
    return (
      <Container>
        <WebSelect value={value} onChange={handleChange}>
          {options.map(({ label, key }) => (
            <option key={`${label}-${key}`} value={key}>
              {label}
            </option>
          ))}
        </WebSelect>
      </Container>
    );
  }

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
