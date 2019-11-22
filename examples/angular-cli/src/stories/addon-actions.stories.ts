import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Addon/Actions',
};

export const ActionOnly = () => ({
  component: Button,
  props: {
    text: 'Action only',
    onClick: action('log 1'),
  },
});

ActionOnly.story = {
  name: 'Action only',
};

export const ActionAndMethod = () => ({
  component: Button,
  props: {
    text: 'Action and Method',
    onClick: e => {
      console.log(e);
      e.preventDefault();
      action('log2')(e.target);
    },
  },
});

ActionAndMethod.story = {
  name: 'Action and method',
};
