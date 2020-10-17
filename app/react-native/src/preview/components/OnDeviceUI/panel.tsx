import { theme } from '@storybook/ondevice-theme';
import React, { PureComponent } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface Props {
  style: any;
}

export default class Panel extends PureComponent<Props> {
  render() {
    // const theme = useTheme();
    const { children, style } = this.props;
    return (
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.backgroundColor }, style]}
      >
        {children}
      </Animated.View>
    );
  }
}
