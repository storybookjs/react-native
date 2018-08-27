import { localStorage } from 'global';
import React, { Children, Component } from 'react';
import styled from '@emotion/styled';
import debounce from 'lodash.debounce';
import Split from 'react-split-pane';

import { PropTypes } from 'prop-types';
import { Route } from '../../router';
import SettingsPages from '../../settings/index';
import { Container, GlobalStyles } from './container';

// TODO: make this safe
const splitStore = {
  get({ id, split }) {
    return parseInt(localStorage.getItem(`storybook-split-${id}-${split}`), 10);
  },
  set: debounce(({ id, split, size }) => {
    localStorage.setItem(`storybook-split-${id}-${split}`, size);
  }, 2000),
};

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

class Desktop extends Component {
  state = {
    isDragging: false,
  };

  render() {
    const {
      Nav,
      Preview,
      Panel,
      options: { isFullscreen, showNav, showPanel, panelPosition },
    } = this.props;
    const { isDragging } = this.state;

    return (
      <Container>
        <GlobalStyles />
        <MemSplit
          id="1"
          split="vertical"
          minSize={50}
          defaultSize={300}
          show={showNav ? [0, 1] : [1]}
          onDragStarted={() => this.setState({ isDragging: true })}
          onDragFinished={() => this.setState({ isDragging: false })}
        >
          <Nav />
          <DesktopPadding left={!showNav}>
            <Route path="/components" startsWith>
              <MemSplit
                id="2"
                split={panelPosition === 'bottom' ? 'horizontal' : 'vertical'}
                defaultSize={300}
                primary="second"
                show={showPanel ? [0, 1] : [0]}
                onDragStarted={() => this.setState({ isDragging: true })}
                onDragFinished={() => this.setState({ isDragging: false })}
              >
                <Rounded border>
                  <Preview full={isFullscreen} isDragging={isDragging} toolbar id="iframe" />
                </Rounded>
                <Rounded>
                  <Panel />
                </Rounded>
              </MemSplit>
            </Route>
            <SettingsPages />
          </DesktopPadding>
        </MemSplit>
      </Container>
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
