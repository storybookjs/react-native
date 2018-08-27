import { storiesOf } from '@storybook/riot';
import ButtonRaw from './Button.txt';

storiesOf('Addon|Actions', module)
  .add('Action only', () => ({
    tags: [{ boundAs: 'my-button', content: ButtonRaw }],
    template: '<my-button handleClick={console.log("log")}>Click me to log the action</my-button>',
  }))
  .add('Multiple actions', () => ({
    tags: [{ boundAs: 'my-button', content: ButtonRaw }],
    template:
      '<my-button :handle-click="click" handleDblClick={console.log("dblclick")}>(Double) click me to log the action</my-button>',
  }));
