import { withKnobs, text, number } from '@storybook/addon-knobs';

import ActionKnobView from './views/ActionKnobView.svelte';

export default {
  title: 'Addon/Knobs',
  decorators: [withKnobs],
};

export const Simple = () => {
  const backgroundColor = text('Background', 'green');
  const width = number('Width', 200, {
    range: true,
    min: 100,
    max: 1000,
    step: 100,
  });

  const height = number('Height', 200, {
    range: true,
    min: 100,
    max: 1000,
    step: 100,
  });

  return {
    Component: ActionKnobView,
    props: {
      backgroundColor,
      width,
      height,
    },
  };
};
