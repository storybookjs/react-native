import React, { ReactNode, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import styled from '@emotion/native';

const ActiveBorder = styled.View<{ active: boolean }>(({ active, theme }) => ({
  backgroundColor: active ? theme.borderColor || '#e6e6e6' : 'transparent',
  height: 3,
}));

const ButtonText = styled.Text<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.buttonActiveTextColor || '#444444' : theme.buttonTextColor || '#999999',
  paddingHorizontal: 8,
  paddingVertical: 10,
  fontSize: 11,
}));

const styles = StyleSheet.create({
  focussedButton: {
    backgroundColor: 'grey',
  },
});

interface Props {
  id: number | string;
  active: boolean;
  onPress: (id: number | string) => void;
  testID?: string;
  children: ReactNode;
}

const Button = ({ onPress, id, active, children, testID }: Props) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <TouchableOpacity
      testID={testID}
      onPress={() => onPress(id)}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      activeOpacity={0.8}
      style={[isFocus && styles.focussedButton]}
    >
      <ButtonText active={active || isFocus}>{children}</ButtonText>
      <ActiveBorder active={active} />
    </TouchableOpacity>
  );
};

export default React.memo(Button);
