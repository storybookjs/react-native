import React, { PureComponent } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import style from '../style';

interface Props {
  onPress: () => void;
}

export default class VisibilityButton extends PureComponent<Props> {
  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        testID="Storybook.OnDeviceUI.toggleUI"
        accessibilityLabel="Storybook.OnDeviceUI.toggleUI"
        style={style.hideButton}
        hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
      >
        <Text style={style.hideButtonText}>□</Text>
      </TouchableOpacity>
    );
  }
}
