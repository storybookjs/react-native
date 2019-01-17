import React from 'react';
import addons from '@storybook/addons';
import StoryPanel from './StoryPanel';
import { ADDON_ID, PANEL_ID } from '.';

export function register() {
  addons.register(ADDON_ID, api => {
    const channel = addons.getChannel();
    addons.addPanel(PANEL_ID, {
      title: 'Story',
      // eslint-disable-next-line react/prop-types
      render: ({ active, key }) => (
        <StoryPanel key={key} channel={channel} api={api} active={active} />
      ),
    });
  });
}
