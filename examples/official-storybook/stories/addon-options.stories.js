import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Addons|Options', module)
  .add(
    'withOptions setting name',
    () => <div>This story should have changed the name of the storybook</div>,
    {
      options: {
        name: 'Custom Storybook',
      },
    }
  )
  .add(
    'withOptions hiding addon panel',
    () => <div>This story should have changed hidden the addons panel</div>,
    {
      options: {
        showAddonPanel: false,
      },
    }
  );
