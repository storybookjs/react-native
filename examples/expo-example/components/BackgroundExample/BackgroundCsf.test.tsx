import '@testing-library/react-native/extend-expect';
import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as Backgrounds from './BackgroundCsf.stories';

const { Basic } = composeStories(Backgrounds);

test('Background colour is hotpink', () => {
  render(<Basic />);

  expect(screen.getByTestId('addon-backgrounds-container')).toHaveStyle({
    backgroundColor: 'hotpink',
  });
});
