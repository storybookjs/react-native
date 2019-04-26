import React, { PureComponent } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Collection } from '@storybook/addons';
import Button from '../navigation/button';

const style = StyleSheet.create({
  list: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
});

export interface Props {
  panels: Collection;
  addonSelected: string;
  onPressAddon: (id: string) => void;
}

export default class AddonList extends PureComponent<Props> {
  renderTab = (id: string, title: string) => {
    const { addonSelected, onPressAddon } = this.props;

    return (
      <Button active={id === addonSelected} key={id} id={id} onPress={() => onPressAddon(id)}>
        {title}
      </Button>
    );
  };

  render() {
    const { panels } = this.props;
    const addonKeys = Object.keys(panels);

    return (
      <View style={style.list}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {addonKeys.map(id => this.renderTab(id, panels[id].title))}
        </ScrollView>
      </View>
    );
  }
}
