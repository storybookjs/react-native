import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import styled from '@emotion/native';

import { NAVIGATOR, PREVIEW, ADDONS } from './constants';

import { TabBar, TabButton } from '../../Shared/tabs';

export interface NavigationBarProps {
  index: number;
  onPress: (id: number) => void;
  style?: StyleProp<ViewStyle>;
}

const NavigationTabBar = styled(TabBar)(({ theme }) => ({
  paddingHorizontal: theme.tokens.spacing2,
  backgroundColor: theme.navigation.backgroundColor,
  borderColor: theme.navigation.borderColor,
  borderTopWidth: theme.navigation.borderWidth,
}));

export const NavigationBar = React.memo(({ index, onPress, style }: NavigationBarProps) => (
  <NavigationTabBar style={style}>
    <TabButton
      onPress={onPress}
      testID="BottomMenu.Navigator"
      id={NAVIGATOR}
      active={index === NAVIGATOR}
    >
      NAVIGATOR
    </TabButton>
    <TabButton
      onPress={onPress}
      testID="BottomMenu.Preview"
      id={PREVIEW}
      active={index === PREVIEW}
    >
      PREVIEW
    </TabButton>
    <TabButton onPress={onPress} testID="BottomMenu.Addons" id={ADDONS} active={index === ADDONS}>
      ADDONS
    </TabButton>
  </NavigationTabBar>
));
