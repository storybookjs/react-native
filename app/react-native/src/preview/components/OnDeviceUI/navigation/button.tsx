import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

const ActiveBorder = styled.View<{ active: boolean }>(({ active, theme }) => ({
  backgroundColor: active ? theme.borderColor : 'transparent',
  height: 3,
}));

const ButtonText = styled.Text<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.buttonActiveTextColor : theme.buttonTextColor,
  paddingHorizontal: 8,
  paddingVertical: 10,
  fontSize: 11,
}));

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
      <TouchableOpacity onPress={this.onPress} activeOpacity={0.8}>
        <ButtonText active={active}>{children}</ButtonText>
        <ActiveBorder active={active} />
      </TouchableOpacity>
    );
  }
}
