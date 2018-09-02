import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import ThemeProvider from '@emotion/provider';
import { normal as defaultTheme } from '../theme';

import MobileLayout from './mobile';
import DesktopLayout from './desktop';

export const Root = styled.div(
  ({ theme }) => ({
    background: theme.mainBackground,
    fontFamily: theme.mainTextFace,
    color: theme.mainTextColor,
    fontSize: theme.mainTextSize,
  }),
  ({ isMobileDevice }) =>
    isMobileDevice
      ? {
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'auto',
        }
      : {
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }
);

const StoriesPanelInner = styled.div({
  flexGrow: 1,
  position: 'relative',
  height: '100%',
  width: '100%',
  overflow: 'auto',
});

const Layout = props => {
  const {
    isMobileDevice,
    theme,
    addonPanel: AddonPanel,
    storiesPanel: StoriesPanel,
    preview: Preview,
    shortcutsHelp: ShortcutsHelp,
    searchBox: SearchBox,
  } = props;

  return (
    <ThemeProvider theme={theme || defaultTheme}>
      <div>
        <Root isMobileDevice={isMobileDevice}>
          {isMobileDevice ? (
            <MobileLayout>
              <StoriesPanelInner>
                <StoriesPanel />
              </StoriesPanelInner>
              <StoriesPanelInner>
                <Preview />
              </StoriesPanelInner>
              <AddonPanel />
            </MobileLayout>
          ) : (
            <DesktopLayout {...props} />
          )}
        </Root>
        <ShortcutsHelp />
        <SearchBox />
      </div>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  theme: PropTypes.shape({}),
  showStoriesPanel: PropTypes.bool.isRequired,
  showAddonPanel: PropTypes.bool.isRequired,
  goFullScreen: PropTypes.bool.isRequired,
  storiesPanel: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  addonPanel: PropTypes.func.isRequired,
  shortcutsHelp: PropTypes.func.isRequired,
  searchBox: PropTypes.func.isRequired,
  addonPanelInRight: PropTypes.bool.isRequired,
  isMobileDevice: PropTypes.bool.isRequired,
};

Layout.defaultProps = {
  theme: null,
};

export default Layout;
