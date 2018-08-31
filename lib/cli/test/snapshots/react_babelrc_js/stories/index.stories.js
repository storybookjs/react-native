import React from 'react';

import { storiesOf } from '@storybook/react';

const data = {
  user: {
    name: 'Joe',
  },
};

storiesOf('My Component', module)
  .add('state', () => <span>Hello {data.user?.name}</span>)
