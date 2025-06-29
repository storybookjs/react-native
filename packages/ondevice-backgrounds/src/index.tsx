import Container from './container';
import { DecoratorFunction } from 'storybook/internal/csf';

export const withBackgrounds: DecoratorFunction = (Story) => (
  <Container>
    <Story />
  </Container>
);
