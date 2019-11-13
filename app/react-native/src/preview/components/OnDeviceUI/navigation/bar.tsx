import React, { PureComponent } from 'react';
import styled from '@emotion/native';
import Button from './button';
import { NAVIGATOR, PREVIEW, ADDONS } from './constants';

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  paddingHorizontal: 8,
  backgroundColor: theme.backgroundColor,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: theme.borderColor,
}));

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
