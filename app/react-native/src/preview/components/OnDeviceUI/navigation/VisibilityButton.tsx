import React from 'react';
import styled from '@emotion/native';
import { StyleProp, View, ViewStyle } from 'react-native';

interface Props {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const Touchable = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: 'transparent',
  position: 'absolute',
  right: theme.tokens.spacing2,
  bottom: theme.tokens.spacing4,
  zIndex: 100,
}));

const HIDE_ICON_SIZE = 14;
const HIDE_ICON_BORDER_WIDTH = 1;

const Inner = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: HIDE_ICON_SIZE,
  height: HIDE_ICON_SIZE,
  borderRadius: theme.navigation.visibilityBorderRadius,
  overflow: 'hidden',
  borderColor: theme.navigation.visibilityInnerBorderColor,
  borderWidth: HIDE_ICON_BORDER_WIDTH * 2,
}));

const Outer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: HIDE_ICON_SIZE,
  height: HIDE_ICON_SIZE,
  borderRadius: theme.navigation.visibilityBorderRadius,
  overflow: 'hidden',
  borderColor: theme.navigation.visibilityOuterBorderColor,
  borderWidth: HIDE_ICON_BORDER_WIDTH,
}));

const hideIconStyles = {
  width: HIDE_ICON_SIZE,
  height: HIDE_ICON_SIZE,
  marginRight: 4,
};

const HideIcon = () => (
  <View style={hideIconStyles}>
    <Inner />
    <Outer />
  </View>
);

const VisibilityButton = ({ onPress, style }: Props) => (
  <Touchable
    onPress={onPress}
    style={style}
    testID="Storybook.OnDeviceUI.toggleUI"
    accessibilityLabel="Storybook.OnDeviceUI.toggleUI"
    hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
  >
    <HideIcon />
  </Touchable>
);
export default React.memo(VisibilityButton);
