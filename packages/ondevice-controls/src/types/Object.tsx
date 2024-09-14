import React, { useCallback, useState } from 'react';
import { styled } from '@storybook/react-native-theming';
import { ViewStyle } from 'react-native';

import { useResyncValue } from './useResyncValue';
import { inputStyle } from './common';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

export interface ObjectProps {
  arg: {
    name: string;
    value: Record<string, any> | Array<any>;
  };
  onChange: (value: any) => void;
  isPristine: boolean;
}

const Input = styled(BottomSheetTextInput)<{ focused: boolean }>(({ theme, focused }) => ({
  ...inputStyle({ theme, isTextInput: false, focused }),
  minHeight: 60,
}));

const ObjectType = ({ arg, onChange, isPristine }: ObjectProps) => {
  const getJsonString = useCallback(() => {
    try {
      return JSON.stringify(arg.value, null, 2);
    } catch (error) {
      return '';
    }
  }, [arg.value]);

  const [failed, setFailed] = useState(false);

  const { key, setCurrentValue } = useResyncValue(arg.value, isPristine);

  const [focused, setFocused] = useState(false);

  const handleChange = (value) => {
    const withReplacedQuotes = value
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');

    try {
      const json = JSON.parse(withReplacedQuotes.trim());

      onChange(json);

      setCurrentValue(json);

      setFailed(false);
    } catch (err) {
      setFailed(true);
    }
  };

  const extraStyle: ViewStyle = {};

  if (failed) {
    extraStyle.borderWidth = 1;

    extraStyle.borderColor = '#fadddd';

    extraStyle.backgroundColor = '#fff5f5';
  }

  return (
    <Input
      key={key}
      testID={arg.name}
      style={extraStyle}
      defaultValue={getJsonString()}
      onChangeText={handleChange}
      multiline
      autoCapitalize="none"
      underlineColorAndroid="transparent"
      focused={focused}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

ObjectType.serialize = (object) => JSON.stringify(object);

ObjectType.deserialize = (value) => (value ? JSON.parse(value) : {});

export default ObjectType;
