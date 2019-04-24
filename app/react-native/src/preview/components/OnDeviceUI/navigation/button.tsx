import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import { EmotionProps } from '../../Shared/theme';

type EmotionButtonProps = EmotionProps & { active: boolean };

const ActiveBorder = styled.View`
  background: ${(props: EmotionButtonProps) =>
    props.active ? props.theme.borderColor : 'transparent'};
  height: 3;
`;

const ButtonText = styled.Text`
  color: ${(props: EmotionButtonProps) =>
    props.active ? props.theme.buttonActiveTextColor : props.theme.buttonTextColor};
  padding-horizontal: 8;
  padding-vertical: 10;
  font-size: 11;
`;

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
