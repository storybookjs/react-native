import { cancelAnimationFrame, requestAnimationFrame } from 'global';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import styled from '@emotion/styled';

import deepEqual from 'fast-deep-equal';

import ResizeDetector from 'react-resize-detector';

import { Route, Location } from '../../router';
import SettingsPages from '../../settings';
import Split from './split';
import { Root } from './container';

const toSize = ({ width, height, x: left, y: top }) => ({
  width,
  height,
  left,
  top,
});

// TODO: get from theme?
const DesktopPadding = styled.div(({ left }) => ({
  position: 'absolute',
  left: left ? 10 : 0,
  top: 10,
  bottom: 10,
  right: 10,
  width: left ? 'calc(100% - 20px)' : 'calc(100% - 10px)',
  height: 'calc(100% - 20px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Rounded = styled.div(
  ({ rounded, theme }) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    borderRadius: rounded ? theme.mainBorderRadius : 0,
    overflow: 'hidden',
    boxSizing: 'border-box',
  }),
  ({ panelPosition, theme }) => ({
    borderTop: panelPosition === 'bottom' ? theme.mainBorder : '0 none',
    borderLeft: panelPosition === 'right' ? theme.mainBorder : '0 none',
  })
);

const Base = styled.main({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',

  background: 'white',
  borderRadius: 4,
  boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
});

const Container = styled.div(
  ({ animate }) =>
    animate
      ? {
          transition: 'all 0.06s ease-out',
        }
      : {},
  ({ isFullscreen }) =>
    isFullscreen
      ? {
          // position: 'fixed!important',
          position: 'absolute',
          top: '0!important',
          left: '0!important',
          width: '100%!important',
          height: '100%!important',
          zIndex: '5!important',
        }
      : {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          border: '1px solid transparent',
        },
  ({ hidden }) =>
    hidden
      ? {
          visibility: 'none',
        }
      : {},
  ({ top, z }) =>
    top
      ? {
          zIndex: z || '4',
        }
      : {
          zIndex: '3',
        }
);

const Pane = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
});

const getBaseSize = ({ mainSize, panelSize, panelPosition }) => {
  if (mainSize && panelSize) {
    return panelPosition === 'bottom'
      ? {
          width: mainSize.width,
          height: mainSize.height + 10 + panelSize.height,
          top: mainSize.top,
          left: mainSize.left,
        }
      : {
          width: mainSize.width + 10 + panelSize.width,
          height: mainSize.height,
          top: mainSize.top,
          left: mainSize.left,
        };
  }
  if (mainSize) {
    return mainSize;
  }

  return null;
};

class Desktop extends Component {
  state = {
    isDragging: false,
    sizes: {},
  };

  timeout = null;

  componentDidMount() {
    this.sizeUpdate();
    this.rootEl.addEventListener('transitionend', () => {
      this.sizeUpdate();
    });
  }

  setSize = () => {
    this.timeout = null;
    const mainSize = this.mainEl ? toSize(this.mainEl.getBoundingClientRect().toJSON()) : null;
    const navSize = this.navEl ? toSize(this.navEl.getBoundingClientRect().toJSON()) : null;
    const panelSize = this.panelEl ? toSize(this.panelEl.getBoundingClientRect().toJSON()) : null;

    const { sizes } = this.state;

    const mutation = {};
    if (!deepEqual(navSize, sizes.nav)) {
      mutation.nav = navSize;
    }
    if (!deepEqual(mainSize, sizes.main)) {
      mutation.main = mainSize;
    }
    if (!deepEqual(panelSize, sizes.panel)) {
      mutation.panel = panelSize;
    }

    if (mutation.nav || mutation.main || mutation.panel) {
      this.setState(
        {
          sizes: { ...sizes, ...mutation },
        },
        this.sizeUpdate
      );
    }
  };

  sizeUpdate = () => {
    const { timeout } = this;
    if (timeout) {
      cancelAnimationFrame(timeout);
    }
    this.timeout = requestAnimationFrame(this.setSize);
  };

  setDrag = () => {
    this.setState({ isDragging: true });
  };

  unsetDrag = () => {
    this.setState({ isDragging: false });
  };

  render() {
    const {
      Nav,
      Preview,
      Panel,
      options: { isFullscreen, showNav, showPanel, panelPosition },
    } = this.props;
    const {
      isDragging,
      sizes: { nav: navSize, main: mainSize, panel: panelSize },
    } = this.state;

    const baseSize = getBaseSize({ mainSize, panelSize, panelPosition });

    return (
      <Location>
        {({ location }) => (
          <Root
            ref={el => {
              this.rootEl = el;
            }}
          >
            {this.sizeUpdate() || null}
            <ResizeDetector handleWidth handleHeight onResize={this.sizeUpdate} />
            {navSize && showNav ? (
              <Container
                style={navSize}
                animate={!isDragging}
                top={!isDragging}
                z={10}
                hidden={isFullscreen}
              >
                <Nav />
              </Container>
            ) : null}

            <Route path={new RegExp('^/(components|info)/')} hideOnly>
              <Base style={baseSize || {}} animate={!isDragging} hidden={!baseSize} top={false} />
              <Container
                style={mainSize || {}}
                isFullscreen={isFullscreen}
                animate={!isDragging}
                hidden={!mainSize}
                top={!isDragging}
              >
                <Rounded rounded={!isFullscreen}>
                  <Preview toolbar={!isFullscreen} id="iframe" location={location} />
                </Rounded>
              </Container>
            </Route>
            <Route path={new RegExp('^/(components)/')} hideOnly>
              <Container
                style={panelSize || {}}
                animate={!isDragging}
                hidden={!showPanel || !panelSize || isFullscreen}
                top={!isDragging}
              >
                <Rounded panelPosition={panelPosition}>
                  <Panel />
                </Rounded>
              </Container>
            </Route>

            {mainSize ? (
              <Route path="/settings" startsWith>
                <Container
                  animate={!isDragging}
                  style={mainSize}
                  isFullscreen={isFullscreen}
                  top={!isDragging}
                >
                  <SettingsPages />
                </Container>
              </Route>
            ) : null}
            <Container top={isDragging} animate={!isDragging}>
              <Split
                id="0"
                split="vertical"
                show={showNav ? [0, 1] : [1]}
                onChange={this.sizeUpdate}
                onResizeStart={this.setDrag}
                onResizeEnd={this.unsetDrag}
              >
                <Pane
                  key="nav"
                  initialSize="280px"
                  ref={el => {
                    this.navEl = el;
                  }}
                />
                <DesktopPadding left={!showNav} key="other">
                  <Route path="/components" startsWith>
                    <Split
                      id="1"
                      split={panelPosition === 'bottom' ? 'horizontal' : 'vertical'}
                      show={showPanel ? [0, 1] : [0]}
                      onChange={this.sizeUpdate}
                      onResizeStart={this.setDrag}
                      onResizeEnd={this.unsetDrag}
                    >
                      <Pane
                        key="main"
                        ref={el => {
                          this.mainEl = el;
                        }}
                      />
                      <Pane
                        key="panel"
                        initialSize="300px"
                        ref={el => {
                          this.panelEl = el;
                        }}
                      />
                    </Split>
                  </Route>
                  <Route path={new RegExp('^/(settings|info)/')}>
                    <Pane
                      ref={el => {
                        this.mainEl = el;
                      }}
                    />
                  </Route>
                </DesktopPadding>
              </Split>
            </Container>
          </Root>
        )}
      </Location>
    );
  }
}
Desktop.propTypes = {
  Nav: PropTypes.func.isRequired,
  Preview: PropTypes.func.isRequired,
  Panel: PropTypes.func.isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool.isRequired,
    showNav: PropTypes.bool.isRequired,
    showPanel: PropTypes.bool.isRequired,
    panelPosition: PropTypes.string.isRequired,
  }).isRequired,
};

export { Desktop };
