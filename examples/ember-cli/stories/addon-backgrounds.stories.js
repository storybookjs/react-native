import hbs from 'htmlbars-inline-precompile';
import { storiesOf } from '@storybook/ember';

storiesOf('Addon|Backgrounds', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  })
  .add('story 1', () => ({
    template: hbs`<button>You should be able to switch backgrounds for this story</button>`,
  }))
  .add('story 2', () => ({
    template: hbs`<button>This one too!</button>`,
  }));
