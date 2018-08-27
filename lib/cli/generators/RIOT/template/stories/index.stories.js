import { storiesOf } from '@storybook/riot';
import { linkTo } from '@storybook/addon-links';
import { mount } from 'riot';

/* eslint-disable-next-line import/no-webpack-loader-syntax */
import MyButtonRaw from 'raw-loader!./MyButton.tag';
/* eslint-disable-next-line no-unused-vars */
import MyButton from './MyButton.tag';
/* eslint-disable-next-line no-unused-vars */
import Welcome from './Welcome.tag';

storiesOf('Welcome', module).add('to Storybook', () =>
  mount('root', 'welcome', { showApp: () => linkTo('Button') })
);

storiesOf('Button', module)
  .add('with text', () => ({
    tags: ['<my-button>Hello Button</my-button>'],
  }))
  .add('with scenario', () => ({
    tags: [{ content: MyButtonRaw, boundAs: 'MyButton' }],
    template: '<MyButton>With scenario</MyButton>',
  }))
  .add('with some emoji', () => ({
    tags: ['<my-button>😀 😎 👍 💯</my-button>'],
  }));
