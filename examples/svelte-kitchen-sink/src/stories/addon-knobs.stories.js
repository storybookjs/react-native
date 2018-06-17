import { storiesOf } from '@storybook/svelte';
import { withKnobs, text, number } from '@storybook/addon-knobs';

import ActionKnobView from './views/ActionKnobView.svelte';

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
      Component: ActionKnobView,
      data: {
        backgroundColor,
        width,
      },
    };
  });
