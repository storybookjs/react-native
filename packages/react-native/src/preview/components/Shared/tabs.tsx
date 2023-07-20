import React from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import styled from '@emotion/native';

import { useTheme } from '../../../hooks';

const TabButtonText = styled.Text<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.tabs.activeTextColor : theme.tabs.inactiveTextColor,
  paddingVertical: theme.tabs.paddingVertical,
  paddingHorizontal: theme.tabs.paddingHorizontal,
  fontSize: theme.tabs.fontSize,
  fontWeight: theme.tabs.fontWeight,
}));

interface TabButtonProps {
  id: number | string;
  active: boolean;
  onPress: (id: number | string) => void;
  testID?: string;
  children: React.ReactNode;
}

const hitSlop = { top: 8, left: 0, right: 0, bottom: 20 };

const TabButtonTouchable = styled.TouchableOpacity<{ active: boolean }>(({ theme, active }) => ({
  borderWidth: theme.tabs.borderWidth,
  borderColor: active ? theme.tabs.activeBorderColor : theme.tabs.inactiveBorderColor,
  borderRadius: theme.tabs.borderRadius,
  backgroundColor: active ? theme.tabs.activeBackgroundColor : theme.tabs.inactiveBackgroundColor,
}));

export const TabButton = React.memo(({ onPress, id, active, children, testID }: TabButtonProps) => {
  return (
    <TabButtonTouchable
      active={active}
      testID={testID}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
      hitSlop={hitSlop}
    >
      <TabButtonText active={active}>{children}</TabButtonText>
    </TabButtonTouchable>
  );
});

interface TabBarProps {
  /**
   * Should the tab bar contents scroll horizontally?
   */
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const TabBar = React.memo(({ scrollable = false, style, children }: TabBarProps) => {
  const theme = useTheme();
  if (scrollable) {
    children = (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{ paddingHorizontal: theme.tokens.spacing2 }}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <View style={style}>
      <TabBarContainer>{children}</TabBarContainer>
    </View>
  );
});

const TabBarContainer = styled.View(() => ({
  flexDirection: 'row',
  paddingVertical: 6,
  justifyItems: 'center',
}));
