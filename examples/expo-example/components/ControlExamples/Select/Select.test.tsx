import { screen, render } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic, WithLabels, WithMapping } from './Select.stories';

const SelectStory = composeStory(Basic, Meta);
const SelectWithLabelsStory = composeStory(WithLabels, Meta);
const SelectWithMappingStory = composeStory(WithMapping, Meta);

test('select story renders', () => {
  render(<SelectStory />);

  screen.getByText('Selected: ⬅️');
});

test('select with labels story renders', () => {
  render(<SelectWithLabelsStory />);

  screen.getByText('Selected: ⬆');
});

test('select with mapping story renders', () => {
  render(<SelectWithMappingStory />);

  screen.getByText('Selected: ⬆');
});
