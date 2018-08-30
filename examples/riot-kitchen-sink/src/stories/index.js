import { mount, storiesOf } from '@storybook/riot';
import { linkTo } from '@storybook/addon-links';
import ButtonRaw from './Button.txt';
import './Welcome.tag';
import '../App.tag';

storiesOf('Welcome', module).add('Welcome', () =>
  mount('welcome', { goToButton: linkTo('Button') })
);

storiesOf('App', module).add('App', () => mount('app', {}));

storiesOf('Button', module)
  // Works if riot.component is called in the config.js in .storybook
  .add('rounded', () => ({
    tags: [{ boundAs: 'my-button', content: ButtonRaw }],
    template: '<my-button rounded={true}>A Button with rounded edges</my-button>',
  }))
  .add('square', () => ({
    tags: [{ boundAs: 'my-button', content: ButtonRaw }],
    template: '<my-button rounded={false}>A Button with square edges</my-button>',
  }));
