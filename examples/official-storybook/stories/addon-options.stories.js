import React from 'react';
import { storiesOf } from '@storybook/react';

import { withOptions } from '@storybook/addon-options';

storiesOf('Addons|Options', module)
  .addDecorator(withOptions)
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
