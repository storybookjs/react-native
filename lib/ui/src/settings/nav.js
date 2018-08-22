import React from 'react';
import { Explorer } from '@storybook/components';

const SettingsPanel = () => (
  <div>
    <Explorer
      stories={[
        {
          name: 'About storybook',
          id: 'about-storybook',
        },
        {
          name: 'Keyboard shortcuts',
          id: 'keyboard-shortcuts',
        },
      ]}
    />
  </div>
);

export default SettingsPanel;
