import React from 'react';
import { shallow } from 'enzyme';
import Layout from './index';

const LeftPanel = () => null;
const DownPanel = () => null;
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
          showLeftPanel
          showDownPanel
          goFullScreen={false}
          downPanelInRight={false}
          leftPanel={() => <LeftPanel />}
          downPanel={() => <DownPanel />}
          preview={() => <Preview />}
        />
      );

      expect(hides(wrap, LeftPanel)).toBe(false);
      expect(hides(wrap, DownPanel)).toBe(false);
      expect(hides(wrap, Preview)).toBe(false);
    });
  });

  describe('with goFullScreen=true', () => {
    test('should render preview in fullscreen mode', () => {
      const wrap = shallow(
        <Layout
          goFullScreen
          showDownPanel={false}
          showLeftPanel={false}
          downPanelInRight={false}
          leftPanel={() => <LeftPanel />}
          downPanel={() => <DownPanel />}
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

  describe('with showLeftPanel=false', () => {
    test('should hide the leftPanel', () => {
      const wrap = shallow(
        <Layout
          showLeftPanel={false}
          showDownPanel
          downPanelInRight={false}
          goFullScreen={false}
          leftPanel={() => <LeftPanel />}
          downPanel={() => <DownPanel />}
          preview={() => <Preview />}
        />
      );

      expect(hides(wrap, LeftPanel)).toBe(true);
      expect(hides(wrap, DownPanel)).toBe(false);
      expect(hides(wrap, Preview)).toBe(false);
    });
  });

  describe('with showDownPanel=false', () => {
    test('should hide the downPanel', () => {
      const wrap = shallow(
        <Layout
          showLeftPanel
          showDownPanel={false}
          goFullScreen={false}
          downPanelInRight={false}
          leftPanel={() => <LeftPanel />}
          downPanel={() => <DownPanel />}
          preview={() => <Preview />}
        />
      );

      expect(hides(wrap, LeftPanel)).toBe(false);
      expect(hides(wrap, DownPanel)).toBe(true);
      expect(hides(wrap, Preview)).toBe(false);
    });
  });
});
