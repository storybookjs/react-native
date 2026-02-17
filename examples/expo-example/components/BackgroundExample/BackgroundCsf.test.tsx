import { composeStories } from '@storybook/react';
import * as Backgrounds from './BackgroundCsf.stories';

const { Basic } = composeStories(Backgrounds);

test('Background colour defaults to hotpink', () => {
  const backgroundName = Basic.globals?.backgrounds?.value;
  const backgroundOptions = Basic.parameters?.backgrounds?.options;

  expect(backgroundName).toBe('warm');
  expect(backgroundOptions?.[backgroundName]?.value).toBe('hotpink');
});
