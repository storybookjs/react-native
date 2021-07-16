import { View } from 'react-native';
import React from 'react';
import RadioSelect from '../components/RadioSelect';

export interface RadioProps {
  arg: {
    name: string;
    value: string;
    options: Array<any> | Record<string, any>;
  };
  onChange: (value: any) => void;
  isInline: boolean;
}

const RadioType = ({ onChange, arg, isInline }: RadioProps) => {
  const getOptions = ({ options }) => {
    if (Array.isArray(options)) {
      return options.map((val) => ({ key: val, label: val }));
    }

    return Object.keys(options).map((key) => ({
      label: key,
      key: options[key],
    }));
  };

  const options = getOptions(arg);

  return (
    <View>
      <RadioSelect
        isInline={isInline}
        data={options}
        value={arg.value}
        onChange={(option) => onChange(option.key)}
      />
    </View>
  );
};

RadioType.serialize = (value) => value;

RadioType.deserialize = (value) => value;

export default RadioType;
