import React from 'react';
import styled from '@emotion/native';
import { View } from 'react-native';

interface Props {
  onPress: () => void;
}

const Touchable = styled.TouchableOpacity({
  backgroundColor: 'transparent',
  position: 'absolute',
  right: 8,
  bottom: 12,
  zIndex: 100,
});

const HIDE_ICON_SIZE = 14;
const HIDE_ICON_BORDER_WIDTH = 1;
const Inner = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: HIDE_ICON_SIZE,
  height: HIDE_ICON_SIZE,
  borderRadius: HIDE_ICON_BORDER_WIDTH,
  overflow: 'hidden',
  borderColor: theme.buttonTextColor || '#999999',
  borderWidth: HIDE_ICON_BORDER_WIDTH * 2,
}));
const Outer = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  width: HIDE_ICON_SIZE,
  height: HIDE_ICON_SIZE,
  borderRadius: HIDE_ICON_BORDER_WIDTH,
  overflow: 'hidden',
  borderColor: 'white',
  borderWidth: HIDE_ICON_BORDER_WIDTH,
});
const HideIcon = () => (
  <View style={{ width: HIDE_ICON_SIZE, height: HIDE_ICON_SIZE, marginRight: 4 }}>
    <Inner />
    <Outer />
  </View>
);

const VisibilityButton = ({ onPress }: Props) => (
  <Touchable
    onPress={onPress}
    testID="Storybook.OnDeviceUI.toggleUI"
    accessibilityLabel="Storybook.OnDeviceUI.toggleUI"
    hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
  >
    <HideIcon />
  </Touchable>
);
export default React.memo(VisibilityButton);
