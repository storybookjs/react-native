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
  // keep track of component IDs that have been rewritten to the ID of their first leaf child
  const componentIdToLeafId = {};

  // 1) remove all leaves
  const leavesRemoved = Object.values(stories).filter(item => !item.isLeaf);

  // 2) make all components leaves and rewrite their ID's to the first leaf child
  const componentsFlattened = leavesRemoved.map(item => {
    const { id, isComponent, children, ...rest } = item;
    const nonLeafChildren = [];
    const leafChildren = [];
    children.forEach(child => (stories[child].isLeaf ? leafChildren : nonLeafChildren).push(child));

    if (leafChildren.length === 0) {
      return item; // pass through, we'll handle you later
    }

    const leafId = leafChildren[0];
    const component = { ...rest, id: leafId, isLeaf: true, isComponent: true };
    componentIdToLeafId[id] = leafId;

    if (
      (isComponent && nonLeafChildren.length > 0) ||
      (!isComponent && nonLeafChildren.length === 0)
    ) {
      throw new Error(
        `Unexpected '${item.id}': ${JSON.stringify({ isComponent, nonLeafChildren })}`
      );
    }

    if (nonLeafChildren.length > 0) {
      logger.error(
        `Node ${item.id} contains non-leaf nodes that are getting removed: ${nonLeafChildren}!`
      );
    }

    return component;
  });

  // 3) rewrite all the children as needed
  const childrenRewritten = componentsFlattened.map(item => {
    if (item.isLeaf) {
      return item;
    }

    const { children, ...rest } = item;
    const rewritten = children.map(child => componentIdToLeafId[child] || child);

    return { children: rewritten, ...rest };
  });

  const result = {};
  childrenRewritten.forEach(item => {
    result[item.id] = item;
  });
  return result;
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

  const stories = docsMode ? removeLeafStories(storiesHash) : storiesHash;

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
