import React from 'react';
import PropTypes from 'prop-types';
import { Global, createGlobal, styled } from '@storybook/theming';
import ResizeDetector from 'react-resize-detector';
import memoize from 'memoizerific';

import { Route } from '@storybook/router';

import { Mobile } from './components/layout/mobile';
import { Desktop } from './components/layout/desktop';
import Nav from './containers/nav';
import Preview from './containers/preview';
import Panel from './containers/panel';
import Notifications from './containers/notifications';

import SettingsPages from './settings';

const createProps = memoize(1)(() => ({
  Nav,
  Preview,
  Panel,
  Notifications,
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

const View = styled.div({
  position: 'fixed',
  overflow: 'hidden',
  height: '100vh',
  width: '100vw',
});

const App = React.memo(({ viewMode, layout }) => {
  const props = createProps();

  return (
    <View>
      <Global styles={createGlobal} />
      <ResizeDetector handleWidth handleHeight>
        {({ width, height }) => {
          if (!width || !height) {
            return <div />;
          }
          if (width < 600) {
            return <Mobile {...props} viewMode={viewMode} options={layout} />;
          }

          return <Desktop {...props} viewMode={viewMode} options={layout} {...{ width, height }} />;
        }}
      </ResizeDetector>
    </View>
  );
});
App.propTypes = {
  viewMode: PropTypes.oneOf(['story', 'info']),
  layout: PropTypes.shape({}).isRequired,
};
App.defaultProps = {
  viewMode: undefined,
};

App.displayName = 'App';

export default App;
