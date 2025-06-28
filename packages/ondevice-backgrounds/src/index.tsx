import * as React from 'react';
import Container from './container';

export const withBackgrounds = (Story: React.ComponentType<any>) => (
  <Container>
    <Story />
  </Container>
);
