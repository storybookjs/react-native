import React from 'react';
import styled from '@emotion/native';
import { ViewStyle } from 'react-native';

interface Props {
  onPress: () => void;
  style?: ViewStyle;
}

const Touchable = styled.TouchableOpacity({
  backgroundColor: 'transparent',
  position: 'absolute',
  right: 8,
  bottom: 12,
  zIndex: 100,
});

const HideIcon = styled.Text(({ theme }) => ({
  fontSize: 14,
  color: theme.buttonTextColor || '#999999',
}));

const VisibilityButton = ({ onPress, style }: Props) => (
  <Touchable
    onPress={onPress}
    style={style}
    testID="Storybook.OnDeviceUI.toggleUI"
    accessibilityLabel="Storybook.OnDeviceUI.toggleUI"
    hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
  >
    <HideIcon>□</HideIcon>
  </Touchable>
);
export default React.memo(VisibilityButton);
