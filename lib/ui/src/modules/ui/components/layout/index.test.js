import React from 'react';
import { shallow } from 'enzyme';
import Layout from './index';

describe('manager.ui.components.layout.index', () => {
  describe('with default options', () => {
    test('should render provided components', () => {
      const wrap = shallow(
        <Layout
          showLeftPanel
          showDownPanel
          goFullScreen={false}
          downPanelInRight={false}
          leftPanel={() => 'LeftPanel'}
          downPanel={() => 'DownPanel'}
          preview={() => 'Preview'}
        />
      );

      const markup = wrap.html();
      expect(markup).toMatch(/LeftPanel/);
      expect(markup).toMatch(/DownPanel/);
      expect(markup).toMatch(/Preview/);
    });
  });

  describe('with goFullScreen=true', () => {
    test('should only render preview', () => {
      const wrap = shallow(
        <Layout
          goFullScreen
          showDownPanel={false}
          showLeftPanel={false}
          downPanelInRight={false}
          leftPanel={() => 'LeftPanel'}
          downPanel={() => 'DownPanel'}
          preview={() => 'Preview'}
        />
      );

      const markup = wrap.html();
      expect(markup).not.toMatch(/LeftPanel/);
      expect(markup).not.toMatch(/DownPanel/);
      expect(markup).toMatch(/Preview/);
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
          leftPanel={() => 'LeftPanel'}
          downPanel={() => 'DownPanel'}
          preview={() => 'Preview'}
        />
      );

      const markup = wrap.html();
      expect(markup).not.toMatch(/LeftPanel/);
      expect(markup).toMatch(/DownPanel/);
      expect(markup).toMatch(/Preview/);
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
          leftPanel={() => 'LeftPanel'}
          downPanel={() => 'DownPanel'}
          preview={() => 'Preview'}
        />
      );

      const markup = wrap.html();
      expect(markup).toMatch(/LeftPanel/);
      expect(markup).not.toMatch(/DownPanel/);
      expect(markup).toMatch(/Preview/);
    });
  });
});
