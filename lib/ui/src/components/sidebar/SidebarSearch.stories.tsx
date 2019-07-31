import React from 'react';
import { actions as makeActions } from '@storybook/addon-actions';

import SidebarSearch, { PureSidebarSearch } from './SidebarSearch';

export default {
  component: SidebarSearch,
  title: 'UI|Sidebar/SidebarSearch',
  decorators: [
    (storyFn: any) => (
      <div style={{ width: '240px', margin: '1rem', padding: '1rem', background: '#999' }}>
        {storyFn()}
      </div>
    ),
  ],
};

const actions = makeActions('onChange');
const pureActions = { ...actions, ...makeActions('onSetFocussed') };

export const simple = () => <SidebarSearch {...actions} />;

export const focussed = () => <PureSidebarSearch {...pureActions} />;

export const filledIn = () => <PureSidebarSearch defaultValue="Searchstring" {...pureActions} />;
