import { styled } from '@storybook/react-native-theming';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useResyncValue } from './useResyncValue';
import { Input } from './common';
import { ControlTypes } from '../sharedTypes';
import SliderWrapper from '../components/SliderWrapper';

const ValueContainer = styled.View({ flexDirection: 'row' });

const LabelText = styled.Text(({ theme }) => ({
  color: theme.color.mediumdark,
  fontSize: theme.typography.size.s1,
}));

const ValueText = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
  fontSize: theme.typography.size.s1,
}));

export interface NumberProps {
  arg: {
    name: string;
    value: number;
    step?: number;
    min?: number;
    max?: number;
    range?: boolean;
    defaultValue: number;
    type: ControlTypes;
    control: {
      min?: number;
      max?: number;
      step?: number;
    };
  };
  isPristine: boolean;

  onChange: (value: number) => void;
}

const getRangeOptions = (arg: NumberProps['arg']) => {
  if (arg.type === 'range') {
    return {
      min: arg.control?.min ?? 0,
      max: arg.control?.max ?? 100,
      step: arg.control?.step ?? 1,
    };
  }

  if (arg.range === true) {
    return {
      min: arg.min ?? 0,
      max: arg.max ?? 100,
      step: arg.step ?? 1,
    };
  }

  return {
    min: 0,
    max: 100,
    step: 1,
  };
};

const NumberType = ({ arg, isPristine, onChange = (value) => value }: NumberProps) => {
  const showError = Number.isNaN(arg.value);
  const [numStr, setNumStr] = useState(arg.value?.toString());
  const updateNumstr = useCallback((value) => setNumStr(value?.toString()), []);
  const { key, setCurrentValue } = useResyncValue(arg.value, isPristine, updateNumstr);
  const [focused, setFocused] = useState(false);
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

  if (arg.range || arg.type === 'range') {
    const { min, max, step } = getRangeOptions(arg);

    return (
      <View key={key}>
        <ValueContainer>
          <LabelText>Value: </LabelText>

          <ValueText>{arg.value}</ValueText>
        </ValueContainer>

        <SliderWrapper
          minimumValue={min}
          maximumValue={max}
          step={step}
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
        hasError={showError}
        focused={focused}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    );
  }
};

export default NumberType;
