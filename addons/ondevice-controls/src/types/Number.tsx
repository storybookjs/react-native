import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import styled from '@emotion/native';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.borderColor || '#e6e6e6',
  borderRadius: 2,
  fontSize: 13,
  padding: 5,
  color: theme.labelColor || 'black',
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

  onChange: (value: number) => void;
}

const NumberType = ({ arg, onChange = (value) => value }: NumberProps) => {
  const showError = Number.isNaN(arg.value);
  const [numStr, setNumStr] = useState(arg.value.toString());

  const handleNormalChangeText = (text: string) => {
    const commaReplaced = text.trim().replace(/,/, '.');

    setNumStr(commaReplaced);
    onChange(Number(commaReplaced));
  };

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

  const renderRange = () => {
    return (
      <Slider
        value={arg.value}
        minimumValue={arg.min}
        maximumValue={arg.max}
        step={arg.step}
        onSlidingComplete={(val) => onChange(val)}
      />
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
