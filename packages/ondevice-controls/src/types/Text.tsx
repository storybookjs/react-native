import React from 'react';
import { styled } from '@storybook/react-native-theming';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { inputStyle } from './common';
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

const Input = styled(BottomSheetTextInput)(({ theme }) => ({
  ...inputStyle(theme),
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

export default TextType;
