import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies

import MenuItem from './menu_item';

storiesOf('UI|MenuItem', module).add('default', () => (
  <MenuItem title="title" onClick={action('onClick')}>
    Content
  </MenuItem>
));
