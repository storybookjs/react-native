import { storiesOf } from '@storybook/vue';
import backgrounds from '@storybook/addon-backgrounds/vue';

storiesOf('Addon|Backgrounds', module)
  .addDecorator(
    backgrounds([
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ])
  )
  .add('story 1', () => {
    const content = 'You should be able to switch backgrounds for this story';

    return {
      template: `<button>${content}</button>`,
    };
  })
  .add('story 2', () => {
    const content = 'This one too!';

    return {
      template: `<button>${content}</button>`,
    };
  });
