import React from 'react';
import memoize from 'memoizerific';

import { Badge } from '@storybook/components';

import { get } from '../settings/persist';
import { keyToSymbol, serializableKeyboardShortcuts } from '../settings/utils';

import Nav from '../components/nav/nav';
import { Consumer } from '../core/context';

const mapSymbol = el => el.reduce((a, b) => `${a} ${keyToSymbol(b)}`, '');

const createMenu = memoize(1)(
  (api, shortcutKeys, isFullscreen, showPanel, showNav, panelPosition) => [
    {
      id: 'about',
      title: 'About your storybook',
      action: () => api.navigate('/settings/about'),
      detail: api.versionUpdateAvailable() && <Badge>Update</Badge>,
      icon: '',
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      action: () => api.navigate('/settings/shortcuts'),
      detail: mapSymbol(shortcutKeys.shortcutsPage),
      icon: '',
    },
    {
      id: 'F',
      title: 'Go Fullscreen',
      action: () => api.toggleFullscreen(),
      detail: mapSymbol(shortcutKeys.fullScreen),
      icon: isFullscreen ? 'check' : '',
    },
    {
      id: 'S',
      title: 'Toggle Panel',
      action: () => api.togglePanel(),
      detail: mapSymbol(shortcutKeys.togglePanel),
      icon: showPanel ? 'check' : '',
    },
    {
      id: 'D',
      title: 'Toggle Panel Position',
      action: () => api.togglePanelPosition(),
      detail: mapSymbol(shortcutKeys.panelPosition),
      icon: panelPosition === 'bottom' ? 'bottombar' : 'sidebaralt',
    },
    {
      id: 'A',
      title: 'Toggle Navigation',
      action: () => api.toggleNav(),
      detail: mapSymbol(shortcutKeys.navigation),
      icon: showNav ? 'check' : '',
    },
    {
      id: '/',
      title: 'Search',
      action: () => {},
      detail: mapSymbol(shortcutKeys.search),
      icon: 'search',
    },
    {
      id: 'up',
      title: 'Previous component',
      action: () => api.jumpToComponent(-1),
      detail: mapSymbol(shortcutKeys.prevComponent),
      icon: '',
    },
    {
      id: 'down',
      title: 'Next component',
      action: () => api.jumpToComponent(1),
      detail: mapSymbol(shortcutKeys.nextComponent),
      icon: '',
    },
    {
      id: 'prev',
      title: 'Previous story',
      action: () => api.jumpToStory(-1),
      detail: mapSymbol(shortcutKeys.prevStory),
      icon: '',
    },
    {
      id: 'next',
      title: 'Next story',
      action: () => api.jumpToStory(1),
      detail: mapSymbol(shortcutKeys.nextStory),
      icon: '',
    },
  ]
);

export const mapper = (state, api) => {
  const {
    ui: { name, url },
    notifications,
    viewMode,
    storyId,
    layout: { isFullscreen, showPanel, showNav, panelPosition },
    storiesHash,
  } = state;

  const shortcutKeys = get('shortcutKeys') || serializableKeyboardShortcuts;
  return {
    title: name,
    url,
    notifications,
    stories: storiesHash,
    storyId,
    viewMode,
    menu: createMenu(api, shortcutKeys, isFullscreen, showPanel, showNav, panelPosition),
    menuHighlighted: api.versionUpdateAvailable(),
  };
};

export default props => (
  <Consumer>{({ state, api }) => <Nav {...props} {...mapper(state, api)} />}</Consumer>
);
