import { cancelAnimationFrame, requestAnimationFrame } from 'global';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import styled from '@emotion/styled';

import deepEqual from 'fast-deep-equal';

import ResizeDetector from 'react-resize-detector';

import { Route } from '../../router';
import SettingsPages from '../../settings';
import Split from './split';
import { Root } from './container';

const toSize = ({ width, height, x: left, y: top }) => ({
  width,
  height,
  left,
  top,
});

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

const Rounded = styled.div(({ border, rounded, theme }) => ({
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
  border: border ? theme.mainBorder : '0 none',
}));

const Container = styled.div(
  {
    transition: 'all 0.06s ease-out',
  },
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
        },
  ({ hidden }) =>
    hidden
      ? {
          visibility: 'none',
        }
      : {},
  ({ top }) =>
    top
      ? {
          zIndex: '4',
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

class Desktop extends Component {
  state = {
    isDragging: false,
    sizes: {},
  };

  timeout = null;

  componentDidMount() {
    this.setSize();
  }

  setSize = () => {
    const { timeout } = this;
    if (timeout) {
      cancelAnimationFrame(timeout);
    }
    this.timeout = requestAnimationFrame(() => {
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
        this.setState({
          sizes: { ...sizes, ...mutation },
        });
      }
    });
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

    this.setSize();

    return (
      <Root>
        <ResizeDetector handleWidth handleHeight onResize={this.setSize} />
        {navSize && showNav ? (
          <Container style={navSize} top={!isDragging} hidden={isFullscreen}>
            <Nav />
          </Container>
        ) : null}

        <Route path="/components" startsWith hideOnly>
          <Container
            style={mainSize || {}}
            isFullscreen={isFullscreen}
            hidden={!mainSize}
            top={!isDragging}
          >
            <Rounded border={!isFullscreen} rounded={!isFullscreen}>
              <Preview toolbar={!isFullscreen} id="iframe" />
            </Rounded>
          </Container>
          <Container
            style={panelSize || {}}
            hidden={!showPanel || !panelSize || isFullscreen}
            top={!isDragging}
          >
            <Rounded border rounded>
              <Panel />
            </Rounded>
          </Container>
        </Route>

        {mainSize ? (
          <Route path="/settings" startsWith>
            <Container style={mainSize} isFullscreen={isFullscreen} top={!isDragging}>
              <SettingsPages />
            </Container>
          </Route>
        ) : null}
        <Container top={isDragging}>
          <Split
            id="0"
            split="vertical"
            show={showNav ? [0, 1] : [1]}
            onChange={this.setSize}
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
                  onChange={this.setSize}
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
              <Route path="/settings" startsWith>
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
