import React from 'react';
import { Badge } from '@storybook/components';
import { get } from '../settings/persist';
import { keyToSymbol, defaultKeyboardShortcuts } from '../settings/utils';
import Nav from '../components/nav/nav';

import { Consumer } from '../core/context';

const mapSymbol = el => el.reduce((a, b) => `${a} ${keyToSymbol('nav')(b)}`, '');

export const mapper = ({ state, api }) => {
  const {
    uiOptions: { name, url },
    notifications,
    ui: { isFullscreen, showPanel, showNav, panelPosition },
  } = state;
  const shortcutKeys = get('shortcutKeys') || defaultKeyboardShortcuts;

  return {
    title: name,
    url,
    notifications,
    stories: state.storiesHash,
    menu: [
      {
        id: 'about',
        title: 'About your storybook',
        action: () => api.navigate('/settings/about'),
        detail: <Badge>Update</Badge>,
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
      {
        id: 'shortcuts',
        title: 'Customize Storybook Hotkeys',
        action: () => api.navigate('/settings/shortcuts'),
        detail: mapSymbol(shortcutKeys.shortcutsPage),
        icon: 'wrench',
      },
    ],
  };
};

export default props => (
  <Consumer>{({ state, api }) => <Nav {...props} {...mapper({ state, api })} />}</Consumer>
);
