import React, { useState, useEffect, useRef } from 'react';
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
    value: any;
    step: number;
    min: number;
    max: number;
    range: boolean;
    defaultValue: number;
  };

  onChange: (value: any) => void;
}

const replaceComma = (value: number | string): string => {
  return typeof value === 'string' ? value.trim().replace(/,/, '.') : value.toString();
};

const NumberType = ({ arg, onChange = (value) => value }: NumberProps) => {
  const allowComma = replaceComma(arg.value);
  const [numStr, setNumStr] = useState(allowComma);
  const numStrRef = useRef(numStr);
  const showError = Number.isNaN(Number(numStr));

  const commitChange = () => {
    onChange(numStr);
  };

  const renderNormal = () => {
    return (
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        value={numStr}
        keyboardType="numeric"
        onChangeText={(text) => {
          const commaReplaced = replaceComma(text);

          setNumStr(commaReplaced);
          numStrRef.current = commaReplaced;
        }}
        onSubmitEditing={commitChange}
        onEndEditing={commitChange}
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

  useEffect(() => {
    return () => {
      onChange(numStrRef.current);
    };
  }, [onChange]);

  return <View style={styles.spacing}>{arg.range ? renderRange() : renderNormal()}</View>;
};

const styles = StyleSheet.create({
  spacing: { margin: 10 },
  errorBorder: { borderColor: '#FF4400' },
});

NumberType.serialize = (value) => String(value);

NumberType.deserialize = (value) => parseFloat(value);

export default NumberType;
