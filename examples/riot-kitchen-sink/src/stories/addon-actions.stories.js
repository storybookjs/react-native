import { storiesOf } from '@storybook/riot';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import ButtonRaw from 'raw-loader!./Button.tag';

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
