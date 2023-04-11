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
  const data = React.useMemo(() => {
    const { options } = arg;
    if (Array.isArray(options)) {
      return options.map((val) => ({ key: val, label: val }));
    }
    return Object.keys(options).map((key) => ({
      label: key,
      key: options[key],
    }));
  }, [arg]);
  const onChangeOption = React.useCallback((option: any) => onChange(option.key), [onChange]);

  return (
    <RadioSelect isInline={isInline} data={data} value={arg.value} onChange={onChangeOption} />
  );
};

RadioType.serialize = (value) => value;

RadioType.deserialize = (value) => value;

export default RadioType;
