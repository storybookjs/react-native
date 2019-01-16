import { storiesOf } from '@storybook/vue';

storiesOf('Addon|Backgrounds', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  })
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
