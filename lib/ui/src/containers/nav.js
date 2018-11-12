import React from 'react';
import { Badge } from '@storybook/components';
import { get } from '../settings/persist';
import { keyToSymbol } from '../settings/utils';
import Nav from '../components/nav/nav';

import { Consumer } from '../core/context';

const mapSymbol = el => el.reduce((a, b) => `${a} ${keyToSymbol('nav')(b)}`, '');

export const mapper = ({ state, manager }) => {
  const {
    uiOptions: { name, url },
    notifications,
    ui: { isFullscreen, showPanel, showNav, panelPosition },
  } = state;
  const shortcutKeys = get('shortcutKeys');

  return {
    title: name,
    url,
    notifications,
    stories: state.storiesHash,
    menu: [
      {
        id: 'about',
        title: 'About your storybook',
        action: () => manager.navigate('/settings/about'),
        detail: <Badge>Update</Badge>,
        icon: '',
      },
      {
        id: 'F',
        title: 'Go Fullscreen',
        action: () => manager.toggleFullscreen(),
        detail: mapSymbol(shortcutKeys.fullScreen),
        icon: isFullscreen ? 'check' : '',
      },
      {
        id: 'S',
        title: 'Toggle Panel',
        action: () => manager.togglePanel(),
        detail: mapSymbol(shortcutKeys.togglePanel),
        icon: showPanel ? 'check' : '',
      },
      {
        id: 'D',
        title: 'Toggle Panel Position',
        action: () => manager.togglePanelPosition(),
        detail: mapSymbol(shortcutKeys.panelPosition),
        icon: panelPosition === 'bottom' ? 'bottombar' : 'sidebaralt',
      },
      {
        id: 'A',
        title: 'Toggle Navigation',
        action: () => manager.toggleNav(),
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
        action: () => manager.jumpToComponent(-1),
        detail: mapSymbol(shortcutKeys.prevComponent),
        icon: '',
      },
      {
        id: 'down',
        title: 'Next component',
        action: () => manager.jumpToComponent(1),
        detail: mapSymbol(shortcutKeys.nextComponent),
        icon: '',
      },
      {
        id: 'prev',
        title: 'Previous story',
        action: () => manager.jumpToStory(-1),
        detail: mapSymbol(shortcutKeys.prevStory),
        icon: '',
      },
      {
        id: 'next',
        title: 'Next story',
        action: () => manager.jumpToStory(1),
        detail: mapSymbol(shortcutKeys.nextStory),
        icon: '',
      },
      {
        id: 'shortcuts',
        title: 'Customize Storybook Hotkeys',
        action: () => manager.navigate('/settings/shortcuts'),
        detail: mapSymbol(shortcutKeys.shortcutsPage),
        icon: 'wrench',
      },
    ],
  };
};

export default props => (
  <Consumer>{({ state, manager }) => <Nav {...props} {...mapper({ state, manager })} />}</Consumer>
);
