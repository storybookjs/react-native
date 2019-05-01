import React, { PureComponent } from 'react';
import { View, ScrollView } from 'react-native';
import { Collection } from '@storybook/addons';
import style from '../style';

export interface Props {
  panels: Collection;
  addonSelected: string;
}

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
          <ScrollView style={style.flex}>
            {panels[id].render({ active: selected, key: id })}
          </ScrollView>
        </View>
      );
    });
  }
}
