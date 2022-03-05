import styled from '@emotion/native';
import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.borderColor || '#e6e6e6',
  borderRadius: 2,
  fontSize: 14,
  paddingVertical: 4,
  paddingHorizontal: 8,
  color: theme.labelColor || 'black',
}));

const SliderText = styled.Text(({ theme }) => ({
  color: theme.labelColor || 'black',
  fontSize: 14,
}));

const ValueLabelText = styled.Text(({ theme }) => ({
  color: theme.secondaryLabelColor || '#999999',
  fontSize: 14,
  marginRight: 8,
}));

const ValueContainer = styled.View({ flexDirection: 'row' });

const NumberSlider = styled(Slider)(() => ({
  marginTop: Platform.OS === 'android' ? 8 : 4,
  marginLeft: Platform.OS === 'android' ? -10 : 0,
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
  const [numStr, setNumStr] = useState(arg.value.toString());

  const handleNormalChangeText = (text: string) => {
    const commaReplaced = text.trim().replace(/,/, '.');

    setNumStr(commaReplaced);
    if (commaReplaced === '-') {
      onChange(-1);
    } else {
      onChange(Number(commaReplaced));
    }
  };

  // handle arg.value and numStr out of sync issue on reset
  useEffect(() => {
    if (isPristine) {
      setNumStr(arg.value.toString());
    }
  }, [isPristine, arg.value]);

  const renderNormal = () => {
    return (
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        value={numStr}
        keyboardType="numeric"
        onChangeText={handleNormalChangeText}
        style={showError && styles.errorBorder}
      />
    );
  };

  const renderRange = (): React.ReactNode => {
    return (
      <>
        <ValueContainer>
          <ValueLabelText>Value:</ValueLabelText>
          <SliderText>{arg.value}</SliderText>
        </ValueContainer>
        <NumberSlider
          minimumValue={arg.min}
          maximumValue={arg.max}
          step={arg.step}
          onValueChange={(val) => onChange(val)}
        />
      </>
    );
  };

  return <View style={styles.spacing}>{arg.range ? renderRange() : renderNormal()}</View>;
};

const styles = StyleSheet.create({
  spacing: { margin: 10 },
  errorBorder: { borderColor: '#FF4400' },
});

NumberType.serialize = (value) => String(value);

NumberType.deserialize = (value) => parseFloat(value);

export default NumberType;
