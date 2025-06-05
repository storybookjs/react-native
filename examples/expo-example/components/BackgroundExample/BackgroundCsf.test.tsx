import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as Backgrounds from './BackgroundCsf.stories';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

const { Basic } = composeStories(Backgrounds, { decorators: [withBackgrounds] });

test('Background colour is hotpink', () => {
  render(<Basic />);

  expect(screen.getByTestId('addon-backgrounds-container')).toHaveStyle({
    backgroundColor: 'hotpink',
  });
});
