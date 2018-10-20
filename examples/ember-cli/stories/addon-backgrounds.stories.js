import hbs from 'htmlbars-inline-precompile';
import { storiesOf } from '@storybook/ember';
import { withBackgrounds } from '@storybook/addon-backgrounds';

storiesOf('Addon|Backgrounds', module)
  .addDecorator(
    withBackgrounds([
      { name: 'LinkedIn', value: '#0073b1', default: true },
      { name: 'Twitter', value: '#00aced' },
      { name: 'Facebook', value: '#3b5998' },
    ])
  )
  .addParameters({ options: { selectedAddonPanel: 'storybook-addon-background/background-panel' } })
  .add('story 1', () => ({
    template: hbs`<button>You should be able to switch backgrounds for this story</button>`,
  }))
  .add('story 2', () => ({
    template: hbs`<button>This one too!</button>`,
  }));
