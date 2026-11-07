import { useState } from 'react';

import { Input } from './common';
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

const TextType = ({ arg, onChange, isPristine }: TextProps) => {
  const { setCurrentValue, key } = useResyncValue(arg.value, isPristine);

  const [focused, setFocused] = useState(false);

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
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      focused={focused}
    />
  );
};

export default TextType;
