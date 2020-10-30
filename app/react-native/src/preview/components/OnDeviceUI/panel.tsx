import { Theme, withTheme } from '@storybook/ondevice-theme';
import React, { PureComponent, ReactNode } from 'react';

import { Animated, StyleSheet } from 'react-native';

interface Props {
  style: any;
  children: ReactNode;
}

class Panel extends PureComponent<Props & { theme: Theme }> {
  render() {
    // const theme = useTheme();
    const { children, style, theme } = this.props;
    return (
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.backgroundColor }, style]}
      >
        {children}
      </Animated.View>
    );
  }
}

export default withTheme<Props>(Panel);
