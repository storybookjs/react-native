import { action } from '@storybook/addon-actions';
import Button from '../components/action-button/index.marko';

export default {
  title: 'Addons|Actions/Button',
  parameters: {
    options: {
      component: Button,
      panelPosition: 'right',
    },
  },
};

export const Simple = () => ({
  input: { click: action('action logged!') },
});
