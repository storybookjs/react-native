import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import MenuItem from './menu_item';

storiesOf('UI|MenuItem', module).add('default', () => (
  <MenuItem title="title" onClick={action('onClick')}>
    Content
  </MenuItem>
));
