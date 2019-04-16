import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from './button';
import { NAVIGATOR, PREVIEW, ADDONS } from './constants';

const style = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#e6e6e6',
    borderTopColor: '#e6e6e6',
  },
});

export interface Props {
  index: number;
  onPress: (id: number) => void;
}

export default class Bar extends PureComponent<Props> {
  render() {
    const { index, onPress } = this.props;
    return (
      <View style={style.bar}>
        <Button onPress={onPress} id={NAVIGATOR} active={index === NAVIGATOR}>
          NAVIGATOR
        </Button>
        <Button onPress={onPress} id={PREVIEW} active={index === PREVIEW}>
          PREVIEW
        </Button>
        <Button onPress={onPress} id={ADDONS} active={index === ADDONS}>
          ADDONS
        </Button>
      </View>
    );
  }
}
