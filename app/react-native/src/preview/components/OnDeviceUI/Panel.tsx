import React from 'react';
import { StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native';
import styled from '@emotion/native';

interface PanelProps {
  edge: 'left' | 'right';
  style: StyleProp<Animated.AnimatedProps<ViewStyle>>;
  children: React.ReactNode;
}

const Container = styled(Animated.View)(({ theme, edge }) => ({
  backgroundColor: theme.panel.backgroundColor,
  borderStartWidth: edge === 'left' ? theme.panel.borderWidth : undefined,
  borderEndWidth: edge === 'right' ? theme.panel.borderWidth : undefined,
  borderColor: theme.panel.borderColor,
}));

const Panel = ({ edge, children, style }: PanelProps) => {
  const containerStyle = StyleSheet.flatten([StyleSheet.absoluteFillObject, style]);
  return (
    <Container edge={edge} style={containerStyle}>
      {children}
    </Container>
  );
};
export default React.memo(Panel);
