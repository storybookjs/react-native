import { storiesOf } from '@storybook/svelte';
import { withKnobs, text, number } from '@storybook/addon-knobs';

import KnobView from './views/KnobView.svelte';

storiesOf('Addon|Knobs', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const backgroundColor = text('Background', 'green');
    const width = number('Width', 200, {
      range: true,
      min: 0,
      max: 1000,
      step: 100,
    });

    return {
      Component: KnobView,
      data: {
        backgroundColor,
        width,
      },
    };
  });
