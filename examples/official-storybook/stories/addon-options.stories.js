import React from 'react';

export default {
  title: 'Addons|Options',
};

export const settingName = () => (
  <div>This story should have changed the name of the storybook</div>
);

settingName.story = {
  name: 'setting name',

  parameters: {
    options: {
      name: 'Custom Storybook',
    },
  },
};

export const hidingAddonPanel = () => (
  <div>This story should have changed hidden the addons panel</div>
);

hidingAddonPanel.story = {
  name: 'hiding addon panel',

  parameters: {
    options: {
      showPanel: false,
    },
  },
};
