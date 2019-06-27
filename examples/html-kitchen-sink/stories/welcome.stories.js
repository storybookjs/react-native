import { withLinks } from '@storybook/addon-links';

import './welcome.css';
import welcome from './welcome.html';

export default {
  title: 'Welcome',
  decorators: [withLinks],
};

export const Welcome = () => welcome;
