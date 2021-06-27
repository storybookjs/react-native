import React from 'react';
import styled from '@emotion/native';
import Button from './Button';
import { NAVIGATOR, PREVIEW, ADDONS } from './constants';

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  paddingHorizontal: 8,
  backgroundColor: theme.backgroundColor || 'white',
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: theme.borderColor || '#e6e6e6',
}));

export interface Props {
  index: number;
  onPress: (id: number) => void;
}

const Bar = ({ index, onPress }: Props) => (
  <Container>
    <Button
      onPress={onPress}
      testID="BottomMenu.Navigator"
      id={NAVIGATOR}
      active={index === NAVIGATOR}
    >
      NAVIGATOR
    </Button>
    <Button onPress={onPress} testID="BottomMenu.Preview" id={PREVIEW} active={index === PREVIEW}>
      PREVIEW
    </Button>
    <Button onPress={onPress} testID="BottomMenu.Addons" id={ADDONS} active={index === ADDONS}>
      ADDONS
    </Button>
  </Container>
);
export default React.memo(Bar);
