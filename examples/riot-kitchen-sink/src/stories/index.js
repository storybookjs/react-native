import { storiesOf } from '@storybook/riot';
import { linkTo } from '@storybook/addon-links';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import ButtonRaw from 'raw-loader!./Button.tag';
import { mount } from 'riot';
// eslint-disable-next-line no-unused-vars
import Welcome from './Welcome.tag';
// eslint-disable-next-line no-unused-vars
import App from '../App.tag';

storiesOf('Welcome', module).add('Welcome', () =>
  mount('root', 'welcome', { goToButton: linkTo('Button') })
);

storiesOf('App', module).add('App', () => mount('root', 'app', {}));

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
