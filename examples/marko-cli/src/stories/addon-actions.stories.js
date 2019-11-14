import { action } from '@storybook/addon-actions';
import Button from '../components/action-button/index.marko';

export default {
  title: 'Addons/Actions/Button',
  parameters: {
    component: Button,
    options: {
      panelPosition: 'right',
    },
  },
};

export const Simple = () => ({
  component: Button,
  input: { click: action('action logged!') },
});
