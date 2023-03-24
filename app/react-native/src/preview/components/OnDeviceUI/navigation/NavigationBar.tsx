import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import styled from '@emotion/native';

import { SIDEBAR, CANVAS, ADDONS } from './constants';

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
      testID="BottomMenu.Sidebar"
      id={SIDEBAR}
      active={index === SIDEBAR}
    >
      SIDEBAR
    </TabButton>
    <TabButton onPress={onPress} testID="BottomMenu.Canvas" id={CANVAS} active={index === CANVAS}>
      CANVAS
    </TabButton>
    <TabButton onPress={onPress} testID="BottomMenu.Addons" id={ADDONS} active={index === ADDONS}>
      ADDONS
    </TabButton>
  </NavigationTabBar>
));
