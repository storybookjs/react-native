import { storiesOf } from '@storybook/riot';
import { withBackgrounds } from '@storybook/addon-backgrounds';
import ButtonRaw from './Button.txt';

storiesOf('Addon|Backgrounds', module)
  .addDecorator(
    withBackgrounds([
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ])
  )
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
