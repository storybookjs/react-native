import { localStorage } from 'global';
import React, { Children, Component } from 'react';
import styled from 'react-emotion';
import debounce from 'lodash.debounce';

import Split from 'react-split-pane';
import { Container, injectGlobalResizerCSS } from './container';

const injectGlobalResizerCSSOnce = (() => {
  let hasBeenAdded = false;

  return () => {
    if (!hasBeenAdded) {
      injectGlobalResizerCSS();
      hasBeenAdded = true;
    }
  };
})();

const MemSplit = ({ id, single, children, defaultSize, split, show, ...props }) =>
  show && show.length < 2 ? (
    Children.toArray(children)[show[0]]
  ) : (
    <Split
      split={split}
      {...props}
      defaultSize={
        parseInt(localStorage.getItem(`storybook-split-${id}-${split}`), 10) || defaultSize
      }
      onChange={debounce(size => {
        localStorage.setItem(`storybook-split-${id}-${split}`, size);
      })}
    >
      {children}
    </Split>
  );

const DesktopPadding = styled('div')(({ left }) => ({
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

const Rounded = styled('div')(({ border, theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  borderRadius: theme.borderRadius,
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
      options: { full = false, nav = true, panel = 'bottom' },
    } = this.props;
    const { isDragging } = this.state;

    return (
      <Container>
        {injectGlobalResizerCSSOnce()}
        <MemSplit
          id="1"
          split="vertical"
          minSize={50}
          defaultSize={300}
          show={nav ? [0, 1] : [1]}
          onDragStarted={() => this.setState({ isDragging: true })}
          onDragFinished={() => this.setState({ isDragging: false })}
        >
          <Nav />
          <DesktopPadding left={!nav}>
            <MemSplit
              id="2"
              split={panel === 'bottom' ? 'horizontal' : 'vertical'}
              defaultSize={300}
              primary="second"
              show={panel ? [0, 1] : [0]}
              onDragStarted={() => this.setState({ isDragging: true })}
              onDragFinished={() => this.setState({ isDragging: false })}
            >
              <Rounded border>
                <Preview full={full} isDragging={isDragging} />
              </Rounded>
              <Rounded>
                <Panel />
              </Rounded>
            </MemSplit>
          </DesktopPadding>
        </MemSplit>
      </Container>
    );
  }
}

export { Desktop };
