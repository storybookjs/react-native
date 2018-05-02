import { storiesOf } from '@storybook/html';
import { withActions, decorate } from '@storybook/addon-actions';

const pickTarget = decorate([args => [args[0].target]]);

const button = () => `<button type="button">Hello World</button>`;

storiesOf('Addons|Actions', module)
  .add('Hello World', () => withActions('click')(button))
  .add('Multiple actions', () => withActions('click', 'contextmenu')(button))
  .add('Multiple actions + config', () =>
    withActions('click', 'contextmenu', { clearOnStoryChange: false })(button)
  )
  .add('Multiple actions, object', () =>
    withActions({ click: 'clicked', contextmenu: 'right clicked' })(button)
  )
  .add('Multiple actions, selector', () =>
    withActions({ 'click .btn': 'clicked', contextmenu: 'right clicked' })(
      () => `
        <div>
          Clicks on this button will be logged: <button class="btn" type="button">Button</button>
        </div>
      `
    )
  )
  .add('Multiple actions, object + config', () =>
    withActions({ click: 'clicked', contextmenu: 'right clicked' }, { clearOnStoryChange: false })(
      button
    )
  )
  .add('Decorated actions', () => pickTarget.withActions('click', 'contextmenu')(button))
  .add('Decorated actions + config', () =>
    pickTarget.withActions('click', 'contextmenu', { clearOnStoryChange: false })(button)
  );
