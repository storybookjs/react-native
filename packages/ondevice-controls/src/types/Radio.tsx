import React from 'react';
import RadioSelect from '../components/RadioSelect';
import { ControlTypes } from '../sharedTypes';

export interface RadioProps {
  arg: {
    type: ControlTypes;
    name: string;
    value: string;
    options?: Array<any> | Record<string, any>;
    control?: {
      options?: Array<any> | Record<string, any>;
      labels?: Array<string>;
    };
  };
  onChange: (value: any) => void;
}

const getOptions = (arg: RadioProps['arg']) => {
  if (arg.options) {
    return arg.options;
  }

  if (arg.control?.options) {
    return arg.control.options;
  }

  return [];
};

const RadioType = ({ onChange, arg }: RadioProps) => {
  const data = React.useMemo(() => {
    const options = getOptions(arg);

    if (Array.isArray(options)) {
      if (arg.control?.labels && Array.isArray(arg.control.labels)) {
        return options.map((val, i) => ({ key: val, label: arg.control.labels.at(i) ?? val }));
      }
      return options.map((val) => ({ key: val, label: val }));
    }

    return Object.keys(options).map((key) => ({
      label: key,
      key: options[key],
    }));
  }, [arg]);
  const onChangeOption = React.useCallback((option: any) => onChange(option.key), [onChange]);

  return (
    <RadioSelect
      isInline={arg.type === 'inline-radio'}
      data={data}
      value={arg.value}
      onChange={onChangeOption}
    />
  );
};

RadioType.serialize = (value) => value;

RadioType.deserialize = (value) => value;

export default RadioType;
