import React from 'react';

import ResizeDetector from 'react-resize-detector';
import { Mobile } from './mobile';
import { Desktop } from './desktop';

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
);

export { Root };
