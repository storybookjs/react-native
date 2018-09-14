import React from 'react';

import Add from '../add';
import Check from '../check';
import ChevronRight from '../chevronRight';
import Component from '../component';
import Gear from '../gear';
import Menu from '../menu';
import More from '../more';
import NewWindow from '../newWindow';
import Split from '../split';
import Storybook from '../storybook';
import Subtract from '../subtract';
import ZoomIn from '../zoomIn';
import ZoomOut from '../zoomOut';

const Icons = {
  Add,
  Check,
  ChevronRight,
  Component,
  Gear,
  Menu,
  More,
  MoreVertical: props => <More {...props} vertical />,
  NewWindow,
  Split,
  SplitVertical: props => <Split {...props} vertical />,
  Storybook,
  Subtract,
  ZoomIn,
  ZoomOut,
};

export { Icons as default };
