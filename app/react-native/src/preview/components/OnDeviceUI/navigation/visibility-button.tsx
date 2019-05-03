import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import { EmotionProps } from '../../Shared/theme';

interface Props {
  onPress: () => void;
}

const Touchable: typeof TouchableOpacity = styled.TouchableOpacity`
  background: transparent;
  position: absolute;
  right: 8;
  bottom: 12;
  z-index: 100;
`;

const HideIcon = styled.Text`
  font-size: 14;
  color: ${(props: EmotionProps) => props.theme.buttonTextColor};
`;

export default class VisibilityButton extends PureComponent<Props> {
  render() {
    const { onPress } = this.props;
    return (
      <Touchable
        onPress={onPress}
        testID="Storybook.OnDeviceUI.toggleUI"
        accessibilityLabel="Storybook.OnDeviceUI.toggleUI"
        hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
      >
        <HideIcon>□</HideIcon>
      </Touchable>
    );
  }
}
