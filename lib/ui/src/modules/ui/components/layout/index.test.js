import React from 'react';
import { shallow } from 'enzyme';
import Layout from './index';

const StoriesPanel = () => null;
const AddonPanel = () => null;
const Preview = () => null;

const hides = (wrap, Component) =>
  wrap
    .find(Component)
    .parents('[style]')
    .someWhere(parent => parent.prop('style').display === 'none');

describe('manager.ui.components.layout.index', () => {
  describe('with default options', () => {
    test('should render provided components', () => {
      const wrap = shallow(
        <Layout
          showStoriesPanel
          showAddonPanel
          goFullScreen={false}
          addonPanelInRight={false}
          storiesPanel={() => <StoriesPanel />}
          addonPanel={() => <AddonPanel />}
          preview={() => <Preview />}
        />
      );

      expect(hides(wrap, StoriesPanel)).toBe(false);
      expect(hides(wrap, AddonPanel)).toBe(false);
      expect(hides(wrap, Preview)).toBe(false);
    });
  });

  describe('with goFullScreen=true', () => {
    test('should render preview in fullscreen mode', () => {
      const wrap = shallow(
        <Layout
          goFullScreen
          showAddonPanel={false}
          showStoriesPanel={false}
          addonPanelInRight={false}
          storiesPanel={() => <StoriesPanel />}
          addonPanel={() => <AddonPanel />}
          preview={() => <Preview />}
        />
      );

      expect(hides(wrap, Preview)).toBe(false);

      const previewParentStyle = wrap
        .find(Preview)
        .parent()
        .prop('style');
      expect(previewParentStyle).toMatchObject({
        position: 'fixed',
        left: '0px',
        right: '0px',
        top: '0px',
        zIndex: 1,
      });
    });
  });

  describe('with showStoriesPanel=false', () => {
    test('should hide the storiesPanel', () => {
      const wrap = shallow(
        <Layout
          showStoriesPanel={false}
          showAddonPanel
          addonPanelInRight={false}
          goFullScreen={false}
          storiesPanel={() => <StoriesPanel />}
          addonPanel={() => <AddonPanel />}
          preview={() => <Preview />}
        />
      );

      expect(hides(wrap, StoriesPanel)).toBe(true);
      expect(hides(wrap, AddonPanel)).toBe(false);
      expect(hides(wrap, Preview)).toBe(false);
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
          storiesPanel={() => <StoriesPanel />}
          addonPanel={() => <AddonPanel />}
          preview={() => <Preview />}
        />
      );

      expect(hides(wrap, StoriesPanel)).toBe(false);
      expect(hides(wrap, AddonPanel)).toBe(true);
      expect(hides(wrap, Preview)).toBe(false);
    });
  });
});
