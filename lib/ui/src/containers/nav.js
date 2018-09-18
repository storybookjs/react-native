import React from 'react';
import { inject } from 'mobx-react';

import { Badge } from '@storybook/components';

import Nav from '../components/nav/nav';

export const mapper = ({ store, uiStore }) => {
  const {
    uiOptions: { name, url },
    notifications,
  } = store;

  return {
    title: name,
    url,
    notifications,
    stories: store.storiesHash,
    menu: [
      {
        id: 'about',
        title: 'About your storybook',
        action: () => store.navigate('/settings'),
        detail: <Badge>Update</Badge>,
        icon: '',
      },
      {
        id: 'F',
        title: 'Go Fullscreen',
        action: () => uiStore.toggleFullscreen(),
        detail: 'F',
        icon: uiStore.isFullscreen ? 'Check' : '',
      },
      {
        id: 'D',
        title: 'Toggle Panel',
        action: () => uiStore.togglePanel(),
        detail: 'D',
        icon: uiStore.showPanel ? 'Check' : '',
      },
      {
        id: 'G',
        title: 'Toggle Panel Position',
        action: () => uiStore.togglePanelPosition(),
        detail: 'G',
        icon: uiStore.panelPosition === 'bottom' ? 'Split' : 'SplitVertical',
      },
      {
        id: 'S',
        title: 'Toggle Navigation',
        action: () => uiStore.toggleNav(),
        detail: 'S',
        icon: uiStore.showNav ? 'Check' : '',
      },
      {
        id: '/',
        title: 'Search',
        action: () => console.log('search'),
        detail: '/',
        icon: 'ZoomIn',
      },
      {
        id: 'next',
        title: 'Next story',
        action: () => store.jumpToStory(1),
        detail: '⇧+→',
        icon: '',
      },
      {
        id: 'prev',
        title: 'Previous story',
        action: () => store.jumpToStory(-1),
        detail: '⇧+←',
        icon: '',
      },
    ],
  };
};

export default inject(({ store, uiStore }) => mapper({ store, uiStore }))(Nav);
