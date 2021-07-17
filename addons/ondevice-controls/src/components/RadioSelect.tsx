import styled from '@emotion/native';
import React from 'react';
import { StyleSheet } from 'react-native';

interface RadioProps {
  data: Array<Record<string, any>>;
  value: string;
  onChange: Function;
  isInline: boolean;
}

const RadioContainer = styled.View(({ isInline }: any) => ({
  flexDirection: isInline ? 'row' : 'column',
  alignItems: isInline ? 'center' : 'flex-start',
  flexWrap: 'wrap',
  margin: 10,
}));

const RadioTouchable = styled.TouchableOpacity(() => ({
  marginRight: 8,
  alignItems: 'center',
  flexDirection: 'row',
  padding: 4,
}));

const RadioCircle = styled.View(({ theme }) => ({
  width: 16,
  height: 16,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 4,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.borderColor || '#e6e6e6',
}));

const RadioInnerCircle = styled.View(({ selected }: any) => ({
  position: 'absolute',
  height: 12,
  width: 12,
  borderRadius: 6,
  backgroundColor: selected ? '#66bf3c' : 'transparent',
}));

const RadioLabel = styled.Text(() => ({
  fontSize: 13,
}));

const RadioSelect = ({ data = [], value = '', onChange, isInline }: RadioProps) => {
  return (
    <RadioContainer isInline={isInline}>
      {data.map((item) => (
        <RadioTouchable
          key={item.label}
          activeOpacity={0.7}
          onPress={() => {
            onChange(item);
          }}
        >
          <RadioCircle>
            <RadioInnerCircle selected={value === item.key} />
          </RadioCircle>
          <RadioLabel>{item.label}</RadioLabel>
        </RadioTouchable>
      ))}
    </RadioContainer>
  );
};

export default RadioSelect;
