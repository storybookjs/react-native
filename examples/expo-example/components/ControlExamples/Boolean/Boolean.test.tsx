import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic, On } from './Boolean.stories';

const BooleanStory = composeStory(Basic, Meta);
const OnStory = composeStory(On, Meta);

test('boolean story renders', () => {
  render(<BooleanStory />);

  screen.getByText('off');
});

test('boolean story renders on', () => {
  render(<OnStory />);

  screen.getByText('on');
});
