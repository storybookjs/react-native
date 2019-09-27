import React from 'react';
import memoize from 'memoizerific';

import { Badge } from '@storybook/components';
import { Consumer } from '@storybook/api';

import { shortcutToHumanString } from '../libs/shortcut';

import ListItemIcon from '../components/sidebar/ListItemIcon';
import Sidebar from '../components/sidebar/Sidebar';

const focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root',
};

const shortcutToHumanStringIfEnabled = (shortcuts, enableShortcuts) =>
  enableShortcuts ? shortcutToHumanString(shortcuts) : null;

const createMenu = memoize(1)(
  (api, shortcutKeys, isFullscreen, showPanel, showNav, enableShortcuts) => [
    {
      id: 'S',
      title: 'Show sidebar',
      onClick: () => api.toggleNav(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.toggleNav, enableShortcuts),
      left: showNav ? <ListItemIcon icon="check" /> : <ListItemIcon />,
    },
    {
      id: 'A',
      title: 'Show addons',
      onClick: () => api.togglePanel(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.togglePanel, enableShortcuts),
      left: showPanel ? <ListItemIcon icon="check" /> : <ListItemIcon />,
    },
    {
      id: 'D',
      title: 'Change addons orientation',
      onClick: () => api.togglePanelPosition(),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.panelPosition, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'F',
      title: 'Go full screen',
      onClick: api.toggleFullscreen,
      right: shortcutToHumanStringIfEnabled(shortcutKeys.fullScreen, enableShortcuts),
      left: isFullscreen ? 'check' : <ListItemIcon />,
    },
    {
      id: '/',
      title: 'Search',
      onClick: () => api.focusOnUIElement(focusableUIElements.storySearchField),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.search, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'up',
      title: 'Previous component',
      onClick: () => api.jumpToComponent(-1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.prevComponent, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'down',
      title: 'Next component',
      onClick: () => api.jumpToComponent(1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.nextComponent, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'prev',
      title: 'Previous story',
      onClick: () => api.jumpToStory(-1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.prevStory, enableShortcuts),
      left: <ListItemIcon />,
    },
    {
      id: 'next',
      title: 'Next story',
      onClick: () => api.jumpToStory(1),
      right: shortcutToHumanStringIfEnabled(shortcutKeys.nextStory, enableShortcuts),
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
      right: shortcutToHumanStringIfEnabled(shortcutKeys.shortcutsPage, enableShortcuts),
      left: <ListItemIcon />,
    },
  ]
);

const collapseDocsOnlyStories = storiesHash => {
  // keep track of component IDs that have been rewritten to the ID of their first leaf child
  const componentIdToLeafId = {};
  const docsOnlyStoriesRemoved = Object.values(storiesHash).filter(item => {
    if (item.isLeaf && item.parameters && item.parameters.docsOnly) {
      componentIdToLeafId[item.parent] = item.id;
      return false; // filter it out
    }
    return true;
  });
  const docsOnlyComponentsCollapsed = docsOnlyStoriesRemoved.map(item => {
    // collapse docs-only components
    const { isComponent, children, id } = item;
    if (isComponent && children.length === 1) {
      const leafId = componentIdToLeafId[id];
      if (leafId) {
        const collapsed = {
          ...item,
          id: leafId,
          isLeaf: true,
          children: undefined,
        };
        return collapsed;
      }
    }

    // update groups
    if (children) {
      const rewritten = children.map(child => componentIdToLeafId[child] || child);
      return { ...item, children: rewritten };
    }

    // pass through stories unmodified
    return item;
  });

  const result = {};
  docsOnlyComponentsCollapsed.forEach(item => {
    result[item.id] = item;
  });
  return result;
};

export const mapper = ({ state, api }) => {
  const {
    ui: { name, url, enableShortcuts },
    viewMode,
    storyId,
    layout: { isFullscreen, showPanel, showNav },
    storiesHash,
    storiesConfigured,
  } = state;
  const stories = collapseDocsOnlyStories(storiesHash);
  const shortcutKeys = api.getShortcutKeys();
  return {
    loading: !storiesConfigured,
    title: name,
    url,
    stories,
    storyId,
    viewMode,
    menu: createMenu(api, shortcutKeys, isFullscreen, showPanel, showNav, enableShortcuts),
    menuHighlighted: api.versionUpdateAvailable(),
  };
};

export default props => (
  <Consumer filter={mapper}>{fromState => <Sidebar {...props} {...fromState} />}</Consumer>
);
