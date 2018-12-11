import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Addons|Options', module)
  .add('setting name', () => <div>This story should have changed the name of the storybook</div>, {
    options: {
      name: 'Custom Storybook',
    },
  })
  .add(
    'hiding addon panel',
    () => <div>This story should have changed hidden the addons panel</div>,
    {
      options: {
        showPanel: false,
      },
    }
  );
