import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/angular/demo';

export default {
  title: 'Addon/Actions',
};

export const actionOnly = () => ({
  component: Button,
  props: {
    text: 'Action only',
    onClick: action('log 1'),
  },
});

actionOnly.story = {
  name: 'Action only',
};

export const actionAndMethod = () => ({
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

actionAndMethod.story = {
  name: 'Action and method',
};
