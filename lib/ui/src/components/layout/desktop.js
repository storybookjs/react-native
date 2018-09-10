import { localStorage, cancelAnimationFrame, requestAnimationFrame } from 'global';
import React, { Children, Component } from 'react';
import { PropTypes } from 'prop-types';
import styled from '@emotion/styled';
import debounce from 'lodash.debounce';
import deepEqual from 'fast-deep-equal';

import Split from 'react-split-pane';
import ResizeDetector from 'react-resize-detector';

import { Route } from '../../router';
import SettingsPages from '../../settings';
import { Root, GlobalStyles } from './container';

const splitStore = {
  get({ id, split }) {
    try {
      return parseInt(localStorage.getItem(`storybook-split-${id}-${split}`), 10);
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  set: debounce(({ id, split, size }) => {
    try {
      localStorage.setItem(`storybook-split-${id}-${split}`, size);
    } catch (e) {
      console.error(e);
    }
  }, 2000),
};

const toSize = ({ width, height, x: left, y: top }) => ({
  width,
  height,
  left,
  top,
});

const MemSplit = ({ id, single, children, defaultSize, split, show, ...props }) =>
  show && show.length < 2 ? (
    Children.toArray(children)[show[0]]
  ) : (
    <Split
      split={split}
      defaultSize={splitStore.get({ id, split }) || defaultSize}
      onChange={size => splitStore.set({ id, split, size })}
      {...props}
    >
      {children}
    </Split>
  );

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

const Rounded = styled.div(({ border, theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  borderRadius: theme.mainBorderRadius,
  overflow: 'hidden',
  boxSizing: 'border-box',
  border: border ? theme.mainBorder : '0 none',
}));

const Container = styled.div(
  ({ isFullscreen }) =>
    isFullscreen
      ? {
          position: 'fixed!important',
          top: '0!important',
          left: '0!important',
          width: '100vw!important',
          height: '100vh!important',
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
          <GlobalStyles />

          <Container
            style={mainSize || {}}
            isFullscreen={isFullscreen}
            hidden={!mainSize}
            top={!isDragging}
          >
            <Rounded>
              <Preview toolbar={!isFullscreen} id="iframe" />
            </Rounded>
          </Container>
          <Container
            style={panelSize || {}}
            hidden={!showPanel || !panelSize || isFullscreen}
            top={!isDragging}
          >
            <Rounded>
              <Panel />
            </Rounded>
          </Container>
        </Route>

        <Route path="/settings" startsWith>
          {mainSize ? (
            <Container style={mainSize} isFullscreen={isFullscreen} top={!isDragging}>
              <SettingsPages />
            </Container>
          ) : null}
        </Route>
        <Container top={isDragging}>
          <MemSplit
            id="1"
            split="vertical"
            minSize={50}
            defaultSize={300}
            show={showNav ? [0, 1] : [1]}
            onChange={this.setSize}
            onDragStarted={() => this.setState({ isDragging: true })}
            onDragFinished={() => this.setState({ isDragging: false })}
          >
            <Container
              ref={el => {
                this.navEl = el;
              }}
            />
            <DesktopPadding left={!showNav}>
              <Route path="/components" startsWith>
                <MemSplit
                  id="2"
                  split={panelPosition === 'bottom' ? 'horizontal' : 'vertical'}
                  defaultSize={300}
                  primary="second"
                  show={showPanel ? [0, 1] : [0]}
                  onChange={this.setSize}
                  onDragStarted={() => this.setState({ isDragging: true })}
                  onDragFinished={() => this.setState({ isDragging: false })}
                >
                  <Container
                    ref={el => {
                      this.mainEl = el;
                    }}
                  />
                  <Container
                    ref={el => {
                      this.panelEl = el;
                    }}
                  />
                </MemSplit>
              </Route>
              <Route path="/settings" startsWith>
                <Container
                  ref={el => {
                    this.mainEl = el;
                  }}
                />
              </Route>
            </DesktopPadding>
          </MemSplit>
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
