import React from 'react';
import { actions as makeActions } from '@storybook/addon-actions';

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

const actions = makeActions('onChange');
const pureActions = { ...actions, ...makeActions('onSetFocussed') };

export const simple = () => <SidebarSearch {...actions} />;

export const focussed = () => <PureSidebarSearch focussed {...pureActions} />;

export const filledIn = () => (
  <PureSidebarSearch focussed defaultValue="Searchstring" {...pureActions} />
);
