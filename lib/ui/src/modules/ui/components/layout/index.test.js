import React from 'react';
import { shallow } from 'enzyme';
import Layout from './index';

jest.mock('react-split-pane', () => function SplitPane() {});

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

      expect(wrap).toMatchSnapshot();
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
          leftPanel={() => 'LeftPanel'}
          downPanel={() => 'DownPanel'}
          preview={() => 'Preview'}
        />
      );

      expect(wrap).toMatchSnapshot();
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

      expect(wrap).toMatchSnapshot();
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

      expect(wrap).toMatchSnapshot();
    });
  });
});
