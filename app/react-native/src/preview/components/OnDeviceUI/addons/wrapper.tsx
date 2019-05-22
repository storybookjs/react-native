import React, { PureComponent } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Collection } from '@storybook/addons';

export interface Props {
  panels: Collection;
  addonSelected: string;
}

const style = StyleSheet.create({
  invisible: {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
});

export default class Wrapper extends PureComponent<Props> {
  static defaultProps = {
    addonSelected: '',
  };

  render() {
    const { panels, addonSelected } = this.props;

    const addonKeys = Object.keys(panels);

    return addonKeys.map(id => {
      const selected = addonSelected === id;

      return (
        <View key={id} style={selected ? style.flex : style.invisible}>
          <ScrollView>{panels[id].render({ active: selected, key: id })}</ScrollView>
        </View>
      );
    });
  }
}
