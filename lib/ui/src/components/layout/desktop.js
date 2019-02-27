import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import ResizeDetector from 'react-resize-detector';

import * as S from './container';

const Desktop = React.memo(({ Panel, Nav, Preview, Notifications, pages, options, viewMode }) => (
  <S.Root>
    <Notifications
      placement={{
        position: 'fixed',
        bottom: 20,
        left: 20,
      }}
    />

    <ResizeDetector handleWidth handleHeight>
      {(width, height) =>
        width && height ? (
          <S.Layout options={options} bounds={{ width, height }} viewMode={viewMode}>
            {({ navProps, mainProps, panelProps, previewProps }) => (
              <Fragment>
                <S.Nav {...navProps}>
                  <Nav debug={navProps} />
                </S.Nav>
                <S.Main {...mainProps}>
                  <S.Preview
                    {...previewProps}
                    hidden={!(viewMode === 'story' || viewMode === 'info')}
                  >
                    <Preview id="main" debug={previewProps} />
                  </S.Preview>

                  <S.Panel {...panelProps} hidden={viewMode !== 'story'}>
                    <Panel debug={panelProps} />
                  </S.Panel>

                  {pages.map(({ key, route: Route, render: content }) => (
                    <Route key={key}>{content()}</Route>
                  ))}
                </S.Main>
              </Fragment>
            )}
          </S.Layout>
        ) : (
          <div />
        )
      }
    </ResizeDetector>
  </S.Root>
));

Desktop.displayName = 'DesktopLayout';
Desktop.propTypes = {
  Nav: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  Preview: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  Panel: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  Notifications: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      route: PropTypes.func.isRequired,
      render: PropTypes.func.isRequired,
    })
  ).isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool.isRequired,
    showNav: PropTypes.bool.isRequired,
    showPanel: PropTypes.bool.isRequired,
    panelPosition: PropTypes.string.isRequired,
    isToolshown: PropTypes.bool.isRequired,
  }).isRequired,
  viewMode: PropTypes.oneOf(['story', 'info']),
};
Desktop.defaultProps = {
  viewMode: undefined,
};

export { Desktop };
