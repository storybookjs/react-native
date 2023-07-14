import React from 'react';
import { StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native';
import styled from '@emotion/native';

interface PanelProps {
  edge: 'left' | 'right' | 'top';
  style: StyleProp<Animated.AnimatedProps<ViewStyle>>;
  children: React.ReactNode;
}

const Container = styled(Animated.View)<{ edge: 'left' | 'right' | 'top' }>(({ theme, edge }) => ({
  backgroundColor: theme.panel.backgroundColor,
  borderTopWidth: edge === 'top' ? theme.panel.borderWidth : undefined,
  borderStartWidth: edge === 'left' ? theme.panel.borderWidth : undefined,
  borderEndWidth: edge === 'right' ? theme.panel.borderWidth : undefined,
  borderColor: theme.panel.borderColor,
}));

const Panel = ({ edge, children, style }: PanelProps) => {
  const containerStyle = StyleSheet.flatten([
    edge === 'top' ? undefined : StyleSheet.absoluteFillObject,
    style,
  ]);
  return (
    <Container edge={edge} style={containerStyle}>
      {children}
    </Container>
  );
};
export default React.memo(Panel);
