import React from 'react';
import { storiesOf } from '@storybook/react';

import Layout from './index';

const panelStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  color: 'white',
};

const componentStubs = {
  storiesPanel: () => <div style={{ ...panelStyle, background: '#4abdac' }}>Stories</div>,
  addonPanel: () => <div style={{ ...panelStyle, background: '#fc4a1a' }}>Addon</div>,
  preview: () => <div style={{ ...panelStyle, background: '#f7b733' }}>Preview</div>,
  searchBox: () => <div />,
  shortcutsHelp: () => <div />,
};

storiesOf('Components|Layout', module)
  .add('default', () => (
    <Layout
      showStoriesPanel
      showAddonPanel
      goFullScreen={false}
      addonPanelInRight={false}
      isMobileDevice={false}
      {...componentStubs}
    />
  ))
  .add('mobile', () => (
    <Layout
      isMobileDevice
      showStoriesPanel
      showAddonPanel
      goFullScreen={false}
      addonPanelInRight={false}
      {...componentStubs}
    />
  ))
  .add('full screen', () => (
    <Layout
      showStoriesPanel={false}
      showAddonPanel={false}
      goFullScreen
      addonPanelInRight={false}
      isMobileDevice={false}
      {...componentStubs}
    />
  ))
  .add('no stories panel', () => (
    <Layout
      showStoriesPanel={false}
      showAddonPanel
      goFullScreen={false}
      addonPanelInRight={false}
      isMobileDevice={false}
      {...componentStubs}
    />
  ))
  .add('no addon panel', () => (
    <Layout
      showStoriesPanel
      showAddonPanel={false}
      goFullScreen={false}
      addonPanelInRight={false}
      isMobileDevice={false}
      {...componentStubs}
    />
  ))
  .add('addon panel in right', () => (
    <Layout
      showStoriesPanel
      showAddonPanel
      goFullScreen={false}
      addonPanelInRight
      isMobileDevice={false}
      {...componentStubs}
    />
  ));
