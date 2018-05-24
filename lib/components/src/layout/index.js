import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';

import { normal } from '../theme';

import MobileLayout from './mobile';
import DesktopLayout from './desktop';

export const Root = styled('div')(
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

const StoriesPanelInner = styled('div')({
  flexGrow: 1,
  position: 'relative',
  height: '100%',
  width: '100%',
  overflow: 'auto',
});

const Layout = props => {
  const {
    isMobileDevice,
    addonPanel: AddonPanel,
    storiesPanel: StoriesPanel,
    preview: Preview,
  } = props;

  return (
    <ThemeProvider theme={normal}>
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
    </ThemeProvider>
  );
};

Layout.propTypes = {
  showStoriesPanel: PropTypes.bool.isRequired,
  showAddonPanel: PropTypes.bool.isRequired,
  goFullScreen: PropTypes.bool.isRequired,
  storiesPanel: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  addonPanel: PropTypes.func.isRequired,
  addonPanelInRight: PropTypes.bool.isRequired,
  isMobileDevice: PropTypes.bool,
};

Layout.defaultProps = {
  isMobileDevice: false,
};

export default Layout;
