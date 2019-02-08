import { storiesOf } from '@storybook/riot';
import ButtonRaw from './Button.txt';

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
      tags: [{ boundAs: 'my-button', content: ButtonRaw }],
      template: `<my-button>${content}</my-button>`,
    };
  })
  .add('story 2', () => {
    const content = 'This one too!';

    return {
      tags: [{ boundAs: 'my-button', content: ButtonRaw }],
      template: `<my-button>${content}</my-button>`,
    };
  });
