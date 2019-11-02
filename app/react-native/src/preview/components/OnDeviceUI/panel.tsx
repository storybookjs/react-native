import React, { PureComponent } from 'react';
import { StyleSheet, Animated } from 'react-native';
import styled from '@emotion/native';

const Container = styled(Animated.View)(({ theme }) => ({
  backgroundColor: theme.backgroundColor,
}));

interface Props {
  style: any[];
}

export default class Panel extends PureComponent<Props> {
  render() {
    const { children, style } = this.props;
    return <Container style={[StyleSheet.absoluteFillObject, ...style]}>{children}</Container>;
  }
}
