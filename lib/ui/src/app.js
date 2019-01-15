import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import ResizeDetector from 'react-resize-detector';
import memoize from 'memoizerific';

import { Route } from '@storybook/router';

import { Mobile } from './components/layout/mobile';
import { Desktop } from './components/layout/desktop';
import Nav from './containers/nav';
import Preview from './containers/preview';
import Panel from './containers/panel';

import SettingsPages from './settings';

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

const createProps = memoize(1)(() => ({
  Nav,
  Preview,
  Panel,
  pages: [
    {
      key: 'settings',
      render: () => <SettingsPages />,
      // eslint-disable-next-line react/prop-types
      route: ({ children }) => (
        <Route path="/settings" startsWith>
          {children}
        </Route>
      ),
    },
  ],
}));

const App = React.memo(({ viewMode, layout }) => {
  const props = createProps();

  return (
    <Reset>
      <ResizeDetector handleWidth>
        {width => {
          if (width === 0) {
            return <div />;
          }
          if (width < 600) {
            return <Mobile {...props} viewMode={viewMode} />;
          }
          return <Desktop {...props} viewMode={viewMode} options={layout} />;
        }}
      </ResizeDetector>
    </Reset>
  );
});
App.propTypes = {
  viewMode: PropTypes.string.isRequired,
  layout: PropTypes.shape({}).isRequired,
};

App.displayName = 'App';

export default App;
