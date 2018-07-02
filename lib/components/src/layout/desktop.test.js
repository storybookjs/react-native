import React from 'react';
import { shallow } from 'enzyme';
import Layout from './desktop';

const StoriesPanel = () => null;
const AddonPanel = () => null;
const Preview = () => null;
const SearchBox = () => null;
const ShortcutsHelp = () => null;

const componentStubs = {
  storiesPanel: () => <StoriesPanel />,
  addonPanel: () => <AddonPanel />,
  preview: () => <Preview />,
  searchBox: () => <SearchBox />,
  shortcutsHelp: () => <ShortcutsHelp />,
};

describe('manager.ui.components.layout.index', () => {
  describe('with default options', () => {
    test('should render provided components', () => {
      const wrap = shallow(
        <Layout
          showStoriesPanel
          showAddonPanel
          addonPanelInRight={false}
          goFullScreen={false}
          {...componentStubs}
        />
      );

      expect(wrap.find('storiesPanel')).toBeTruthy();
      expect(wrap.find('addonPanel')).toBeTruthy();
      expect(wrap.find('preview')).toBeTruthy();
    });
    test('should render correct splits', () => {
      const wrap = shallow(
        <Layout
          showStoriesPanel
          showAddonPanel
          addonPanelInRight={false}
          goFullScreen={false}
          {...componentStubs}
        />
      );

      expect(wrap.find('storiesPanel').closest('SplitPane')).toHaveProp({
        size: 250,
        split: 'vertical',
      });
      expect(wrap.find('preview').closest('SplitPane')).toHaveProp({
        size: 200,
        split: 'horizontal',
      });
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
          {...componentStubs}
        />
      );

      expect(wrap.find('preview').parent()).toHaveProp({
        fullscreen: true,
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
          {...componentStubs}
        />
      );

      expect(wrap.find('storiesPanel').closest('SplitPane')).toHaveProp({
        size: 1,
        split: 'vertical',
      });
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
          {...componentStubs}
        />
      );

      expect(wrap.find('addonPanel').parent()).toHaveProp({
        showAddonPanel: false,
      });
    });
  });
});
