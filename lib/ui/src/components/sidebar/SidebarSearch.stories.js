import React from 'react';
import { action } from '@storybook/addon-actions';

import SidebarSearch, { PureSidebarSearch } from './SidebarSearch';

export default {
  Component: SidebarSearch,
  title: 'UI|Sidebar/SidebarSearch',
  decorators: [
    storyFn => (
      <div style={{ width: '240px', margin: '1rem', padding: '1rem', background: '#999' }}>
        {storyFn()}
      </div>
    ),
  ],
};

export const simple = () => <SidebarSearch />;

const onSetFocussed = action('onSetFocussed');
export const focussed = () => <PureSidebarSearch focussed onSetFocussed={onSetFocussed} />;

export const filledIn = () => (
  <PureSidebarSearch focussed onSetFocussed={onSetFocussed} defaultValue="Searchstring" />
);
