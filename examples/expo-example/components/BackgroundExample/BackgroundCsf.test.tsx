import '@testing-library/react-native/extend-expect';
import { render, screen } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import Meta, { Basic } from './BackgroundCsf.stories';

const BackgroundCsfStory = composeStory(Basic, Meta);

test('Background colour is hotpink', () => {
  render(<BackgroundCsfStory />);

  expect(screen.getByTestId('addon-backgrounds-container')).toHaveStyle({
    backgroundColor: 'hotpink',
  });
});
