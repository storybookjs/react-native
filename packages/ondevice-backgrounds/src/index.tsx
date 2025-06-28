import * as React from 'react';
import Container from './container';

export const withBackgrounds = ({ Story }: { Story: React.ComponentType }) => (
  <Container>
    <Story />
  </Container>
);
