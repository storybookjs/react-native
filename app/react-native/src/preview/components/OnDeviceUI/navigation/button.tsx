import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const style = StyleSheet.create({
  text: {
    color: '#999999',
    paddingHorizontal: 8,
    paddingVertical: 10,
    fontSize: 11,
  },
  underline: {
    height: 3,
    backgroundColor: 'transparent',
  },
});

interface Props {
  id: number | string;
  active: boolean;
  onPress: (id: number | string) => void;
}

export default class Button extends PureComponent<Props> {
  onPress = () => {
    const { onPress, id } = this.props;
    onPress(id);
  };

  render() {
    const { active, children } = this.props;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Text
          style={[
            style.text,
            active && {
              color: 'rgb(68, 68, 68)',
            },
          ]}
        >
          {children}
        </Text>
        <View
          style={[
            style.underline,
            active && {
              backgroundColor: '#e6e6e6',
            },
          ]}
        />
      </TouchableOpacity>
    );
  }
}
