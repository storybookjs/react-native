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
    value: string;
    options: Array<any> | Record<string, any>;
    selectV2: boolean;
  };
  onChange: (value: any) => void;
}

const getOptions = ({ options }: SelectProps['arg']) => {
  if (Array.isArray(options)) {
    return options.map((val) => ({ key: val, label: val }));
  }

  return Object.keys(options).map((key) => ({
    label: key,
    key: options[key],
  }));
};

const SelectType = (props: SelectProps) => {
  console.log('propit');
  console.log(JSON.stringify(props));
  const { arg, onChange } = props;
  const options = getOptions(arg);
  const active = options.filter(({ key }) => arg.value === key)[0];
  const selected = active && active.label;

  return (
    <View>
      <ModalPicker
        data={options}
        initValue={arg.value}
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
