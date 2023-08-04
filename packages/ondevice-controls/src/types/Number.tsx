import Slider from '@react-native-community/slider';
import { styled } from '@storybook/react-native-theming';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { inputStyle } from './common';
import { useResyncValue } from './useResyncValue';

const Input = styled.TextInput<{ showError: boolean }>(({ theme, showError }) => {
  const style = inputStyle(theme);
  return {
    ...style,
    borderColor: showError ? theme.inputs.errorTextColor : style.borderColor,
  };
});

const ValueContainer = styled.View({ flexDirection: 'row' });
const LabelText = styled.Text(({ theme }) => ({
  color: theme.inputs.slider.labelTextColor,
  fontSize: theme.inputs.slider.fontSize,
}));
const ValueText = styled.Text(({ theme }) => ({
  color: theme.inputs.slider.valueTextColor,
  fontSize: theme.inputs.slider.fontSize,
}));

export interface NumberProps {
  arg: {
    name: string;
    value: number;
    step: number;
    min: number;
    max: number;
    range: boolean;
    defaultValue: number;
  };
  isPristine: boolean;

  onChange: (value: number) => void;
}

const NumberType = ({ arg, isPristine, onChange = (value) => value }: NumberProps) => {
  const showError = Number.isNaN(arg.value);
  const [numStr, setNumStr] = useState(arg.value?.toString());
  const updateNumstr = useCallback((value) => setNumStr(value?.toString()), []);
  const { key, setCurrentValue } = useResyncValue(arg.value, isPristine, updateNumstr);

  const handleNormalChangeText = (text: string) => {
    const commaReplaced = text.trim().replace(/,/, '.');

    setNumStr(commaReplaced);
    if (commaReplaced === '-') {
      onChange(-1);
      setCurrentValue(-1);
    } else {
      onChange(Number(commaReplaced));
      setCurrentValue(Number(commaReplaced));
    }
  };

  if (arg.range) {
    return (
      <View key={key}>
        <ValueContainer>
          <LabelText>Value: </LabelText>
          <ValueText>{arg.value}</ValueText>
        </ValueContainer>
        <Slider
          minimumValue={arg.min}
          maximumValue={arg.max}
          step={arg.step}
          value={arg.value}
          onSlidingComplete={(val) => {
            onChange(val);
            setCurrentValue(val);
          }}
        />
      </View>
    );
  } else {
    return (
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        value={numStr}
        keyboardType="numeric"
        onChangeText={handleNormalChangeText}
        showError={showError}
      />
    );
  }
};

NumberType.serialize = (value) => String(value);

NumberType.deserialize = (value) => parseFloat(value);

export default NumberType;
