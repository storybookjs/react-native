import { withActions, decorate } from '@storybook/addon-actions';

const pickTarget = decorate([args => [args[0].target]]);

const button = () => `<button type="button">Hello World</button>`;

export default {
  title: 'Addons/Actions',
};

export const Story1 = () => withActions('click')(button);
Story1.story = { name: 'Hello World' };
export const Story2 = () => withActions('click', 'contextmenu')(button);
Story2.story = { name: 'Multiple actions' };

export const Story3 = () =>
  withActions('click', 'contextmenu', { clearOnStoryChange: false })(button);
Story3.story = { name: 'Multiple actions + config' };

export const Story4 = () => withActions({ click: 'clicked', contextmenu: 'right clicked' })(button);
Story4.story = { name: 'Multiple actions, object' };

export const Story5 = () =>
  withActions({ 'click .btn': 'clicked', contextmenu: 'right clicked' })(
    () => `
        <div>
          Clicks on this button will be logged: <button class="btn" type="button">Button</button>
        </div>
      `
  );
Story5.story = { name: 'Multiple actions, selector' };

export const Story6 = () =>
  withActions(
    { click: 'clicked', contextmenu: 'right clicked' },
    { clearOnStoryChange: false }
  )(button);
Story6.story = { name: 'Multiple actions, object + config' };

export const Story7 = () => pickTarget.withActions('click', 'contextmenu')(button);
Story7.story = { name: 'Decorated actions' };

export const Story8 = () =>
  pickTarget.withActions('click', 'contextmenu', { clearOnStoryChange: false })(button);
Story8.story = { name: 'Decorated actions + config' };
