import styled from '@emotion/native';
import React from 'react';

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
}));

const RadioTouchable = styled.TouchableOpacity(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
  paddingVertical: theme.inputs.radio.itemSpacing,
}));

const RadioCircle = styled.View(({ theme }) => ({
  width: theme.inputs.radio.height,
  height: theme.inputs.radio.height,
  borderWidth: theme.inputs.radio.borderWidth,
  borderColor: theme.inputs.radio.borderColor,
  borderRadius: theme.tokens.borderRadius.round,
  backgroundColor: theme.inputs.radio.backgroundColor,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: theme.inputs.radio.paddingVertical,
  paddingHorizontal: theme.inputs.radio.paddingHorizontal,
}));

const RadioInnerCircle = styled.View(({ theme, selected }: any) => ({
  height: '100%',
  width: '100%',
  borderRadius: theme.tokens.borderRadius.round,
  backgroundColor: selected ? theme.inputs.radio.activeBackgroundColor : 'transparent',
}));

const RadioLabel = styled.Text(({ theme }) => ({
  fontSize: theme.inputs.radio.fontSize,
  paddingStart: theme.inputs.radio.labelSpacing,
  color: theme.inputs.labelTextColor,
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
