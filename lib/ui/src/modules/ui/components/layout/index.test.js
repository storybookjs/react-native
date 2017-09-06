import React from 'react';
import { shallow } from 'enzyme';
import Layout from './index';

describe('manager.ui.components.layout.index', () => {
  describe('with default options', () => {
    test('should render provided components', () => {
      const wrap = shallow(
        <Layout
          showStoriesPanel
          showAddonPanel
          goFullScreen={false}
          addonPanelInRight={false}
          storiesPanel={() => 'StoriesPanel'}
          addonPanel={() => 'AddonPanel'}
          preview={() => 'Preview'}
        />
      );

      const markup = wrap.html();
      expect(markup).toMatch(/StoriesPanel/);
      expect(markup).toMatch(/AddonPanel/);
      expect(markup).toMatch(/Preview/);
    });
  });

  describe('with goFullScreen=true', () => {
    test('should only render preview', () => {
      const wrap = shallow(
        <Layout
          showStoriesPanel={false}
          showAddonPanel={false}
          goFullScreen
          addonPanelInRight={false}
          storiesPanel={() => 'StoriesPanel'}
          addonPanel={() => 'AddonPanel'}
          preview={() => 'Preview'}
        />
      );

      const markup = wrap.html();
      expect(markup).not.toMatch(/StoriesPanel/);
      expect(markup).not.toMatch(/AddonPanel/);
      expect(markup).toMatch(/Preview/);
    });
  });

  describe('with showStoriesPanel=false', () => {
    test('should hide the storiesPanel', () => {
      const wrap = shallow(
        <Layout
          showStoriesPanel={false}
          showAddonPanel
          goFullScreen={false}
          addonPanelInRight={false}
          storiesPanel={() => 'StoriesPanel'}
          addonPanel={() => 'AddonPanel'}
          preview={() => 'Preview'}
        />
      );

      const markup = wrap.html();
      expect(markup).not.toMatch(/StoriesPanel/);
      expect(markup).toMatch(/AddonPanel/);
      expect(markup).toMatch(/Preview/);
    });
  });

  describe('with showAddonPanel=false', () => {
    test('should hide the addonPanel', () => {
      const wrap = shallow(
        <Layout
          showStoriesPanel
          showAddonPanel={false}
          goFullScreen={false}
          addonPanelInRight={false}
          storiesPanel={() => 'StoriesPanel'}
          addonPanel={() => 'AddonPanel'}
          preview={() => 'Preview'}
        />
      );

      const markup = wrap.html();
      expect(markup).toMatch(/StoriesPanel/);
      expect(markup).not.toMatch(/AddonPanel/);
      expect(markup).toMatch(/Preview/);
    });
  });
});
