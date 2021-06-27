import React, { ReactNode } from 'react';
import { StyleSheet, Animated } from 'react-native';
import styled from '@emotion/native';

const Container = styled(Animated.View)(({ theme }) => ({
  backgroundColor: theme.backgroundColor || 'white',
}));

interface Props {
  style: any[];
  children: ReactNode;
}

const Panel = ({ children, style }: Props) => (
  <Container style={[StyleSheet.absoluteFillObject, ...style]}>{children}</Container>
);
export default React.memo(Panel);
