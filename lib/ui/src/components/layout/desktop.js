import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import ResizeDetector from 'react-resize-detector';

import * as S from './container';

const Desktop = React.memo(({ Panel, Nav, Preview, pages, options, viewMode }) => (
  <S.Root>
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
                    hidden={!(viewMode === 'components' || viewMode === 'info')}
                  >
                    <Preview
                      isFullscreen={previewProps.isFullscreen}
                      isToolshown={previewProps.isToolshown}
                      id="iframe"
                      debug={previewProps}
                    />
                  </S.Preview>

                  <S.Panel {...panelProps} hidden={viewMode !== 'components'}>
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
          <div>0 width or height</div>
        )
      }
    </ResizeDetector>
  </S.Root>
));

Desktop.displayName = 'DesktopLayout';
Desktop.propTypes = {
  Nav: PropTypes.func.isRequired,
  Preview: PropTypes.func.isRequired,
  Panel: PropTypes.func.isRequired,
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
  viewMode: PropTypes.oneOf(['components', 'info']),
  storyId: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  location: PropTypes.shape({}).isRequired,
};
Desktop.defaultProps = {
  viewMode: undefined,
};

export { Desktop };
