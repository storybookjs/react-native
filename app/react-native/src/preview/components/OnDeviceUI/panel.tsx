import React, { PureComponent } from 'react';
import { StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native';

const style = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#e6e6e6',
    backgroundColor: '#ffffff',
  },
});

interface Props {
  style: any[];
}

export default class Panel extends PureComponent<Props> {
  render() {
    const { children, style: propsStyle } = this.props;
    return <Animated.View style={[style.panel, ...propsStyle]}>{children}</Animated.View>;
  }
}
