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
    {width =>
      width > 500 ? (
        <Desktop {...{ Nav, Preview, Panel, options }} />
      ) : (
        <Mobile {...{ Nav, Preview, Panel, options }} />
      )
    }
  </ResizeDetector>
);

export { Root };
