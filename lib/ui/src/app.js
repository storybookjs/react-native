import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Global, createGlobal } from '@storybook/theming';
import ResizeDetector from 'react-resize-detector';
import memoize from 'memoizerific';

import { Route } from '@storybook/router';

import { Mobile } from './components/layout/mobile';
import { Desktop } from './components/layout/desktop';
import Nav from './containers/nav';
import Preview from './containers/preview';
import Panel from './containers/panel';

import SettingsPages from './settings';

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
    <Fragment>
      <Global styles={createGlobal} />
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
    </Fragment>
  );
});
App.propTypes = {
  viewMode: PropTypes.string.isRequired,
  layout: PropTypes.shape({}).isRequired,
};

App.displayName = 'App';

export default App;
