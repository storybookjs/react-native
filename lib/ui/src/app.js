import React from 'react';
import styled from '@emotion/styled';
import ResizeDetector from 'react-resize-detector';
import { inject, observer } from 'mobx-react';

import { Mobile } from './components/layout/mobile';
import { Desktop } from './components/layout/desktop';
import Nav from './containers/nav';
import Preview from './containers/preview';
import Panel from './containers/panel';

const Reset = styled.div(({ theme }) => ({
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

const App = ({ uiStore }) => {
  const props = {
    Nav,
    Preview,
    Panel,
    options: {
      ...uiStore,
    },
  };

  return (
    <Reset>
      <ResizeDetector handleWidth>
        {width => {
          if (width === 0) return <div />;
          if (width < 600) return <Mobile {...props} />;
          return <Desktop {...props} />;
        }}
      </ResizeDetector>
    </Reset>
  );
};

// TODO: use a uiStore and observer in the layout
export default inject('uiStore')(observer(App));
