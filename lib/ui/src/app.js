import React from 'react';
import styled from 'react-emotion';
import ResizeDetector from 'react-resize-detector';
import { inject } from 'mobx-react';

import { Mobile } from './components/layout/mobile';
import { Desktop } from './components/layout/desktop';
import Nav from './containers/nav';
import Preview from './containers/preview';
import Panel from './containers/panel';

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

const App = ({ options }) => {
  const props = {
    Nav,
    Preview,
    Panel,
    options,
  };

  return (
    <Reset>
      <ResizeDetector handleWidth>
        {width => {
          if (width === 0) return <div />;
          if (width < 500) return <Mobile {...props} />;
          return <Desktop {...props} />;
        }}
      </ResizeDetector>
    </Reset>
  );
};

// TODO: use a uiStore and observer in the layout
export default inject(({ store }) => ({ options: { ...store.shortcutOptions } }))(App);
