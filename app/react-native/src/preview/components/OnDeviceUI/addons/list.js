import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet } from 'react-native';

import Button from '../navigation/button';

const style = StyleSheet.create({
  list: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
});

export default class AddonList extends PureComponent {
  renderTab = (id, title) => {
    const { addonSelected, onPressAddon } = this.props;

    return (
      <Button active={id === addonSelected} key={id} id={id} onPress={onPressAddon}>
        {title}
      </Button>
    );
  };

  render() {
    const { panels } = this.props;
    const addonKeys = Object.keys(panels);

    return (
      <View style={style.list}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={style.addonList}>
          {addonKeys.map(id => this.renderTab(id, panels[id].title))}
        </ScrollView>
      </View>
    );
  }
}

AddonList.propTypes = {
  panels: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    }).isRequired
  ).isRequired,
  onPressAddon: PropTypes.func.isRequired,
  addonSelected: PropTypes.string.isRequired,
};
