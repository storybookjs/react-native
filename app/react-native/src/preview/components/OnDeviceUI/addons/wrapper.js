import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import style from '../style';

export default class Wrapper extends PureComponent {
  render() {
    const { panels, addonSelected } = this.props;

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 60 : 0;

    const addonKeys = Object.keys(panels);

    return addonKeys.map(id => {
      const selected = addonSelected === id;

      return (
        <View key={id} style={selected ? style.flex : style.invisible}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? null : 'padding'}
            keyboardVerticalOffset={keyboardVerticalOffset}
            style={style.flex}
          >
            <ScrollView style={style.flex}>{panels[id].render({ active: selected })}</ScrollView>
          </KeyboardAvoidingView>
        </View>
      );
    });
  }
}

Wrapper.propTypes = {
  panels: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    }).isRequired
  ).isRequired,
  addonSelected: PropTypes.string,
};

Wrapper.defaultProps = {
  addonSelected: '',
};
