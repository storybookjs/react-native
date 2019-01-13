import hbs from 'htmlbars-inline-precompile';
import { storiesOf } from '@storybook/ember';
import { checkA11y } from '@storybook/addon-a11y';

storiesOf('Addon|a11y', module)
  .addDecorator(checkA11y)
  .addParameters({ options: { selectedPanel: '@storybook/a11y/panel' } })
  .add('Default', () => hbs`<button></button>`)
  .add('Label', () => hbs`<button>Testing the a11y addon</button>`)
  .add('Disabled', () => hbs`<button disabled>Testing the a11y addon</button>`)
  .add(
    'Invalid contrast',
    () =>
      hbs`<button style="color: black; background-color: brown;">Testing the a11y addon</button>`
  );
