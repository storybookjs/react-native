import React from 'react';
import { action, actions as makeActions } from '@storybook/addon-actions';
import { Icons } from '@storybook/components';

import MenuItem from './MenuItem';

const actions = makeActions('onHide');
export default {
  component: MenuItem,
  title: 'UI|Menu/MenuItem',
  storyData: { actions },
};

function buildExample(menuItem) {
  const story = () => <MenuItem menuItem={menuItem} {...actions} />;
  story.storyData = { menuItem };
  return story;
}

export const simple = buildExample({
  title: 'Menu Item',
  action: action('onActivateMenuItem'),
});

export const withIcon = buildExample({
  ...simple.storyData.menuItem,
  icon: <Icons icon="mobile" />,
});

export const withDetail = buildExample({
  ...simple.storyData.menuItem,
  detail: 'Some detail here',
});

export const full = buildExample({
  ...withIcon.storyData.menuItem,
  ...withDetail.storyData.menuItem,
});
