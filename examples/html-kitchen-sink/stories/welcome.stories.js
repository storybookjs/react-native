import { storiesOf } from '@storybook/html';
import { withLinks } from '@storybook/addon-links';

import './welcome.css';
import welcome from './welcome.html';

storiesOf('Welcome', module)
  .addDecorator(withLinks)
  .add('Welcome', () => welcome);
