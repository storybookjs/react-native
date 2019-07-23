import React from 'react';
import PropTypes from 'prop-types';
import { Global, createGlobal, styled } from '@storybook/theming';
import memoize from 'memoizerific';
import sizeMe from 'react-sizeme';

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

const App = React.memo(({ viewMode, layout, panelCount, size: { width, height } }) => {
  const props = createProps();

  let content;

  if (!width || !height) {
    content = (
      <div>
        {width} x {height}
      </div>
    );
  } else if (width < 600) {
    content = <Mobile {...props} viewMode={viewMode} options={layout} panelCount={panelCount} />;
  } else {
    content = (
      <Desktop
        {...props}
        viewMode={viewMode}
        options={layout}
        {...{ width, height }}
        panelCount={panelCount}
      />
    );
  }

  return (
    <View>
      <Global styles={createGlobal} />
      {content}
    </View>
  );
});
App.propTypes = {
  viewMode: PropTypes.oneOf(['story', 'info', 'docs', 'settings']),
  panelCount: PropTypes.number.isRequired,
  layout: PropTypes.shape({}).isRequired,
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};
App.defaultProps = {
  viewMode: undefined,
};

const SizedApp = sizeMe({ monitorHeight: true })(App);

App.displayName = 'App';

export default SizedApp;
