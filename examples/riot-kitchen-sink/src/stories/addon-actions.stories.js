import { mount, compileNow } from '@storybook/riot';
import { action } from '@storybook/addon-actions';
import ButtonRaw from './Button.txt';

compileNow(ButtonRaw);

export default {
  title: 'Addon/Actions',
};

export const ActionOnly = () =>
  mount('my-button', {
    handleClick: action('button-click'),
    content: 'Click me to log the action',
  });

ActionOnly.story = {
  name: 'Action only',
};

export const MultipleActions = () =>
  mount('my-button', {
    handleDblClick: action('button-double-click'),
    content: 'Double Click me to log the action',
  });

MultipleActions.story = {
  name: 'Multiple actions',
};
