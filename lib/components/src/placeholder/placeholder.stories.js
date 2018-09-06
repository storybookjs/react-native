import React from 'react';
import { storiesOf } from '@storybook/react';

import Placeholder from './placeholder';

storiesOf('Components|Placeholder', module).add('default', () => (
  <Placeholder>This is a placeholder</Placeholder>
));
