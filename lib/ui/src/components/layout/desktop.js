import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';

import ResizeDetector from 'react-resize-detector';

import { Route, Location } from '../../router';
import SettingsPages from '../../settings';

import * as S from './container';

const Desktop = ({ Panel, Nav, Preview, options }) => (
  <S.Root>
    <Location>
      {({ location }) => (
        <ResizeDetector handleWidth handleHeight>
          {(width, height) =>
            width && height ? (
              <S.Layout location={location} options={options} bounds={{ width, height }}>
                {({ navProps, mainProps, panelProps, previewProps }) => (
                  <Fragment>
                    <S.Nav {...navProps}>
                      <Nav debug={navProps} />
                    </S.Nav>
                    <S.Main {...mainProps}>
                      <S.Preview
                        {...previewProps}
                        hidden={!location.match(/^\/(components|info)\//)}
                      >
                        <Preview
                          isFullscreen={previewProps.isFullscreen}
                          isToolshown={previewProps.isToolshown}
                          id="iframe"
                          location={location}
                          debug={previewProps}
                        />
                      </S.Preview>

                      <S.Panel {...panelProps} hidden={!location.match(/\/components/)}>
                        <Panel debug={panelProps} />
                      </S.Panel>

                      <Route path="/settings" startsWith>
                        <SettingsPages />
                      </Route>
                    </S.Main>
                  </Fragment>
                )}
              </S.Layout>
            ) : (
              <div>blaaat</div>
            )
          }
        </ResizeDetector>
      )}
    </Location>
  </S.Root>
);

Desktop.propTypes = {
  Nav: PropTypes.func.isRequired,
  Preview: PropTypes.func.isRequired,
  Panel: PropTypes.func.isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool.isRequired,
    showNav: PropTypes.bool.isRequired,
    showPanel: PropTypes.bool.isRequired,
    panelPosition: PropTypes.string.isRequired,
    isToolshown: PropTypes.bool.isRequired,
  }).isRequired,
};

export { Desktop };
