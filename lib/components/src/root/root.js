import React from 'react';
import styled from 'react-emotion';

import ResizeDetector from 'react-resize-detector';
import { Mobile } from './mobile';
import { Desktop } from './desktop';

const Reset = styled('div')(({ theme }) => ({
  fontFamily: theme.mainTextFace,
  color: theme.mainTextColor,
  background: theme.mainBackground,
  WebkitFontSmoothing: 'antialiased',
  fontSize: theme.mainTextSize,

  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
}));

const Root = ({
  Nav,
  Preview,
  Panel,
  options = {
    active: 0,
    full: false,
    nav: true,
    panel: 'bottom',
  },
}) => (
  <Reset>
    <ResizeDetector handleWidth>
      {width => {
        switch (true) {
          case width === 0: {
            return <div />;
          }
          case width < 500: {
            return <Mobile {...{ Nav, Preview, Panel, options }} />;
          }
          case width > 500: {
            return <Desktop {...{ Nav, Preview, Panel, options }} />;
          }
          default: {
            return <div />;
          }
        }
      }}
    </ResizeDetector>
  </Reset>
);

export { Root };
