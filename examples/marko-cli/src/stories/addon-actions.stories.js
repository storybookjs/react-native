import { action } from '@storybook/addon-actions';
import Button from '../components/action-button/index.marko';

export default {
  title: 'Addons|Actions/Button',
  parameters: {
    options: { panelPosition: 'right' },
  },
};

export const Simple = () => ({
  template: Button,
  input: { click: action('action logged!') },
});
