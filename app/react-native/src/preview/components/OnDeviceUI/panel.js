import React, { PureComponent } from 'react';
import { StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';

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

export default class Panel extends PureComponent {
  render() {
    const { children, style: propsStyle } = this.props;
    return <Animated.View style={[style.panel, ...propsStyle]}>{children}</Animated.View>;
  }
}

Panel.propTypes = {
  style: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.node.isRequired,
};
