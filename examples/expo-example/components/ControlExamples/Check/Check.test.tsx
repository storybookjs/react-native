import { screen, render } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';

import Meta, { XAxis, XYZAxis, YAxis, ZAxis } from './Check.stories';

const XAxisStory = composeStory(XAxis, Meta);
const YAxisStory = composeStory(YAxis, Meta);
const ZAxisStory = composeStory(ZAxis, Meta);
const XYZAxisStory = composeStory(XYZAxis, Meta);

test('x Axis story renders', () => {
  render(<XAxisStory />);

  screen.getByText('axis: x');
});

test('y Axis story renders', () => {
  render(<YAxisStory />);

  screen.getByText('axis: y');
});

test('z Axis story renders', () => {
  render(<ZAxisStory />);

  screen.getByText('axis: z');
});
test('xyz Axis story renders', () => {
  render(<XYZAxisStory />);

  screen.getByText('axis: x, y, z');
});
