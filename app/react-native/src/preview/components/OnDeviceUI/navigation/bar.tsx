import React, { PureComponent } from 'react';
import styled from '@emotion/native';
import Button from './button';
import { NAVIGATOR, PREVIEW, ADDONS } from './constants';
import { EmotionProps } from '../../Shared/theme';

const Container = styled.View`
  flex-direction: row;
  padding-horizontal: 8;
  background: ${(props: EmotionProps) => props.theme.backgroundColor};
  border-top-width: 1;
  border-bottom-width: 1;
  border-color: ${(props: EmotionProps) => props.theme.borderColor};
`;

export interface Props {
  index: number;
  onPress: (id: number) => void;
}

export default class Bar extends PureComponent<Props> {
  render() {
    const { index, onPress } = this.props;
    return (
      <Container>
        <Button onPress={onPress} id={NAVIGATOR} active={index === NAVIGATOR}>
          NAVIGATOR
        </Button>
        <Button onPress={onPress} id={PREVIEW} active={index === PREVIEW}>
          PREVIEW
        </Button>
        <Button onPress={onPress} id={ADDONS} active={index === ADDONS}>
          ADDONS
        </Button>
      </Container>
    );
  }
}
