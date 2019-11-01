import { mount, compileNow } from '@storybook/riot';
import { action } from '@storybook/addon-actions';
import ButtonRaw from './Button.txt';

compileNow(ButtonRaw);

export default {
  title: 'Addon|Actions',
};

export const actionOnly = () =>
  mount('my-button', {
    handleClick: action('button-click'),
    content: 'Click me to log the action',
  });

actionOnly.story = {
  name: 'Action only',
};

export const multipleActions = () =>
  mount('my-button', {
    handleDblClick: action('button-double-click'),
    content: 'Double Click me to log the action',
  });

multipleActions.story = {
  name: 'Multiple actions',
};
