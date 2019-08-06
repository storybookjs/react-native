import React from 'react';
import memoize from 'memoizerific';
import { DOCS_MODE } from 'global';

import { Badge } from '@storybook/components';
import { Consumer } from '@storybook/api';
import { logger } from '@storybook/client-logger';

import { shortcutToHumanString } from '../libs/shortcut';

import ListItemIcon from '../components/sidebar/ListItemIcon';
import Sidebar from '../components/sidebar/Sidebar';

const focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root',
};

const createMenu = memoize(1)((api, shortcutKeys, isFullscreen, showPanel, showNav) => [
  {
    id: 'S',
    title: 'Show sidebar',
    onClick: () => api.toggleNav(),
    right: shortcutToHumanString(shortcutKeys.toggleNav),
    left: showNav ? <ListItemIcon icon="check" /> : <ListItemIcon />,
  },
  {
    id: 'A',
    title: 'Show addons',
    onClick: () => api.togglePanel(),
    right: shortcutToHumanString(shortcutKeys.togglePanel),
    left: showPanel ? <ListItemIcon icon="check" /> : <ListItemIcon />,
  },
  {
    id: 'D',
    title: 'Change addons orientation',
    onClick: () => api.togglePanelPosition(),
    right: shortcutToHumanString(shortcutKeys.panelPosition),
    left: <ListItemIcon />,
  },
  {
    id: 'F',
    title: 'Go full screen',
    onClick: api.toggleFullscreen,
    right: shortcutToHumanString(shortcutKeys.fullScreen),
    left: isFullscreen ? 'check' : <ListItemIcon />,
  },
  {
    id: '/',
    title: 'Search',
    onClick: () => api.focusOnUIElement(focusableUIElements.storySearchField),
    right: shortcutToHumanString(shortcutKeys.search),
    left: <ListItemIcon />,
  },
  {
    id: 'up',
    title: 'Previous component',
    onClick: () => api.jumpToComponent(-1),
    right: shortcutToHumanString(shortcutKeys.prevComponent),
    left: <ListItemIcon />,
  },
  {
    id: 'down',
    title: 'Next component',
    onClick: () => api.jumpToComponent(1),
    right: shortcutToHumanString(shortcutKeys.nextComponent),
    left: <ListItemIcon />,
  },
  {
    id: 'prev',
    title: 'Previous story',
    onClick: () => api.jumpToStory(-1),
    right: shortcutToHumanString(shortcutKeys.prevStory),
    left: <ListItemIcon />,
  },
  {
    id: 'next',
    title: 'Next story',
    onClick: () => api.jumpToStory(1),
    right: shortcutToHumanString(shortcutKeys.nextStory),
    left: <ListItemIcon />,
  },
  {
    id: 'about',
    title: 'About your Storybook',
    onClick: () => api.navigate('/settings/about'),
    right: api.versionUpdateAvailable() && <Badge status="positive">Update</Badge>,
    left: <ListItemIcon />,
  },
  {
    id: 'shortcuts',
    title: 'Keyboard shortcuts',
    onClick: () => api.navigate('/settings/shortcuts'),
    right: shortcutToHumanString(shortcutKeys.shortcutsPage),
    left: <ListItemIcon />,
  },
]);

export const removeLeafStories = stories => {
  return Object.values(stories).reduce((acc, item) => {
    // filter out leaves
    if (item.isLeaf) {
      return acc;
    }

    const { children, ...rest } = item;
    const component = { ...rest, isLeaf: true, isComponent: true, id: children[0] };
    // make components leaves
    if (item.isComponent) {
      return Object.assign(acc, { [item.id]: component });
    }
    // pass through components that don't contain any leaves
    const nonLeafChildren = children.filter(child => !stories[child].isLeaf);
    if (nonLeafChildren.length === children.length) {
      return Object.assign(acc, { [item.id]: item });
    }

    if (nonLeafChildren.length === 0) {
      throw new Error(
        `Node ${item.id} was not a component but it only contains stories. Something wrong?`
      );
    }

    // make non-components that contain stories leaves
    logger.error(
      `Node ${item.id} contains non-leaf nodes that are getting removed: ${nonLeafChildren}!`
    );
    return Object.assign(acc, { [item.id]: component });
  }, {});
};

const docsMode = !!DOCS_MODE;

export const mapper = ({ state, api }) => {
  const {
    ui: { name, url },
    viewMode,
    storyId,
    layout: { isFullscreen, showPanel, showNav, panelPosition },
    storiesHash,
    storiesConfigured,
  } = state;

  const stories = docsMode ? memoize(1)(removeLeafStories)(storiesHash) : storiesHash;

  console.log({ stories });

  const shortcutKeys = api.getShortcutKeys();
  return {
    loading: !storiesConfigured,
    title: name,
    url,
    stories,
    storyId,
    viewMode,
    menu: createMenu(api, shortcutKeys, isFullscreen, showPanel, showNav, panelPosition),
    menuHighlighted: api.versionUpdateAvailable(),
  };
};

export default props => (
  <Consumer filter={mapper}>{fromState => <Sidebar {...props} {...fromState} />}</Consumer>
);
