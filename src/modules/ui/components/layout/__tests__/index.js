const { describe, it } = global;
import React from 'react';
import { shallow } from 'enzyme';
import Layout from '../index.js';
import { expect } from 'chai';

describe('manager.ui.components.layout.index', () => {
  describe('with default options', () => {
    it('should render provided components', () => {
      const wrap = shallow(
        <Layout
          showLeftPanel
          showDownPanel
          goFullScreen={false}
          leftPanel={() => 'LeftPanel'}
          downPanel={() => 'DownPanel'}
          preview={() => 'Preview'}
        />
      );

      expect(wrap.html()).to.match(/LeftPanel/);
      expect(wrap.html()).to.match(/DownPanel/);
      expect(wrap.html()).to.match(/Preview/);
    });
  });

  describe('with goFullScreen=true', () => {
    it('should only render preview', () => {
      const wrap = shallow(
        <Layout
          showLeftPanel
          showDownPanel
          goFullScreen
          leftPanel={() => 'LeftPanel'}
          downPanel={() => 'DownPanel'}
          preview={() => 'Preview'}
        />
      );

      expect(wrap.html()).not.to.match(/LeftPanel/);
      expect(wrap.html()).not.to.match(/DownPanel/);
      expect(wrap.html()).to.match(/Preview/);
    });
  });

  describe('with showLeftPanel=false', () => {
    it('should hide the leftPanel', () => {
      const wrap = shallow(
        <Layout
          showLeftPanel={false}
          showDownPanel
          goFullScreen={false}
          leftPanel={() => 'LeftPanel'}
          downPanel={() => 'DownPanel'}
          preview={() => 'Preview'}
        />
      );

      expect(wrap.html()).not.to.match(/LeftPanel/);
      expect(wrap.html()).to.match(/DownPanel/);
      expect(wrap.html()).to.match(/Preview/);
    });
  });

  describe('with showDownPanel=false', () => {
    it('should hide the downPanel', () => {
      const wrap = shallow(
        <Layout
          showLeftPanel
          showDownPanel={false}
          goFullScreen={false}
          leftPanel={() => 'LeftPanel'}
          downPanel={() => 'DownPanel'}
          preview={() => 'Preview'}
        />
      );

      expect(wrap.html()).to.match(/LeftPanel/);
      expect(wrap.html()).not.to.match(/DownPanel/);
      expect(wrap.html()).to.match(/Preview/);
    });
  });
});
