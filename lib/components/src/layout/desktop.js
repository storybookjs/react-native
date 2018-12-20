import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { localStorage, window } from 'global';

import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import throttle from 'lodash/throttle';

import SplitPane from 'react-split-pane';

import Dimensions from './dimensions';

const GlobalStyles = () => (
  <Global
    styles={css`
      .Resizer {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .Resizer.horizontal {
        height: 10px;
        margin: -5px 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        cursor: row-resize;
        width: 100%;
      }
      .Resizer.horizontal::after {
        content: '';
        display: block;
        height: 2px;
        width: 20px;
        border-top: 1px solid rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }

      .Resizer.vertical {
        width: 10px;
        margin: 0 -5px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        cursor: col-resize;
      }
      .Resizer.vertical::after {
        content: '';
        display: block;
        width: 2px;
        height: 20px;
        border-left: 1px solid rgba(0, 0, 0, 0.2);
        border-right: 1px solid rgba(0, 0, 0, 0.2);
      }

      .Resizer.disabled {
        visibility: hidden;
      }
    `}
  />
);

const StoriesPanelWrapper = styled.div(
  ({ showStoriesPanel, storiesPanelOnTop, theme: { storiesNav } }) => ({
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    display: showStoriesPanel ? 'flex' : 'none',
    flexDirection: storiesPanelOnTop ? 'column' : 'row',
    alignItems: 'stretch',
    paddingRight: storiesPanelOnTop ? 10 : 0,
    ...storiesNav,
  })
);

const StoriesPanelInner = styled.div({
  flexGrow: 1,
  position: 'relative',
  height: '100%',
  width: '100%',
  overflow: 'auto',
});

const AddonPanelWrapper = styled.div(
  ({ showAddonPanel, addonPanelInRight, theme: { layoutMargin } }) => ({
    display: showAddonPanel ? 'flex' : 'none',
    flexDirection: addonPanelInRight ? 'row' : 'column',
    alignItems: 'stretch',
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: addonPanelInRight
      ? `${layoutMargin}px ${layoutMargin}px ${layoutMargin}px 0`
      : `0 ${layoutMargin}px ${layoutMargin}px 0`,
    boxSizing: 'border-box',
  })
);

const ContentPanel = styled.div(
  ({ addonPanelInRight, storiesPanelOnTop, theme: { layoutMargin } }) => ({
    position: 'absolute',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    padding: addonPanelInRight
      ? `${layoutMargin}px 0 ${layoutMargin}px 0`
      : `${layoutMargin}px ${layoutMargin}px 0 0`,
    paddingTop: storiesPanelOnTop ? 0 : layoutMargin,
  })
);

const PreviewWrapper = styled.div(
  ({ theme }) => ({
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    position: 'relative',
    backgroundColor: theme.mainFill,
  }),
  ({ fullscreen, theme }) =>
    fullscreen
      ? {
          position: 'fixed',
          left: 0,
          right: 0,
          top: 0,
          zIndex: 1,
          border: 0,
          margin: 0,
          padding: 0,
        }
      : {
          border: theme.mainBorder,
          borderRadius: theme.mainBorderRadius,

          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center',
          '& > *': {
            margin: 'auto',
          },
        }
);

const DragBlockOverlay = styled.div(({ isDragging }) => ({
  zIndex: isDragging ? 2 : 0,
  display: isDragging ? 'block' : 'none',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}));

const defaultSizes = {
  addonPanel: {
    down: 200,
    right: 400,
  },
  storiesPanel: {
    left: 250,
    top: 400,
  },
};

const saveSizes = sizes => {
  try {
    localStorage.setItem('panelSizes', JSON.stringify(sizes));
    return true;
  } catch (e) {
    return false;
  }
};

const getSavedSizes = sizes => {
  try {
    const panelSizes = localStorage.getItem('panelSizes');
    if (panelSizes) {
      return JSON.parse(panelSizes);
    }
    saveSizes(sizes);
    return sizes;
  } catch (e) {
    saveSizes(sizes);
    return sizes;
  }
};

class Layout extends Component {
  constructor(props) {
    super(props);

    this.layerSizes = getSavedSizes(defaultSizes);

    this.state = {
      previewPanelDimensions: {
        height: 0,
        width: 0,
      },
      isDragging: false,
    };

    this.throttledUpdatePreviewPanelState = throttle(this.updatePrevewPanelState.bind(this), 200);
    this.throttledSaveSizes = throttle(this.saveSizes, 25);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.throttledUpdatePreviewPanelState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledUpdatePreviewPanelState);
  }

  onDragStart() {
    this.setState({ isDragging: true });
  }

  onDragEnd() {
    this.setState({ isDragging: false });
  }

  onResize(pane, mode, size) {
    this.throttledSaveSizes(pane, mode, size);
    this.throttledUpdatePreviewPanelState();
  }

  saveSizes(pane, mode, size) {
    this.layerSizes[pane][mode] = size;
    saveSizes(this.layerSizes);
  }

  updatePrevewPanelState() {
    const { clientWidth, clientHeight } = this.previewPanelRef;

    this.setState({
      previewPanelDimensions: {
        width: clientWidth,
        height: clientHeight,
      },
    });
  }

  render() {
    const {
      goFullScreen,
      showStoriesPanel,
      showAddonPanel,
      addonPanelInRight,
      addonPanel: AddonPanel,
      storiesPanel: StoriesPanel,
      preview: Preview,
    } = this.props;

    const { previewPanelDimensions, isDragging } = this.state;
    const storiesPanelOnTop = false;
    const addonSplit = addonPanelInRight ? 'vertical' : 'horizontal';
    const storiesSplit = storiesPanelOnTop ? 'horizontal' : 'vertical';

    const sizes = getSavedSizes(this.layerSizes);
    const storiesPanelDefaultSize = !storiesPanelOnTop
      ? sizes.storiesPanel.left
      : sizes.storiesPanel.top;
    const addonPanelDefaultSize = !addonPanelInRight
      ? sizes.addonPanel.down
      : sizes.addonPanel.right;

    return (
      <SplitPane
        split={storiesSplit}
        allowResize={showStoriesPanel}
        minSize={1}
        maxSize={-400}
        size={showStoriesPanel ? storiesPanelDefaultSize : 1}
        defaultSize={storiesPanelDefaultSize}
        onDragStarted={this.onDragStart}
        onDragFinished={this.onDragEnd}
        onChange={size => this.onResize('storiesPanel', storiesPanelOnTop ? 'top' : 'left', size)}
      >
        <StoriesPanelWrapper {...{ showStoriesPanel, storiesPanelOnTop }}>
          <GlobalStyles />
          <StoriesPanelInner>
            <StoriesPanel />
          </StoriesPanelInner>
        </StoriesPanelWrapper>
        <SplitPane
          split={addonSplit}
          allowResize={showAddonPanel}
          primary="second"
          minSize={addonPanelInRight ? 200 : 100}
          maxSize={-200}
          size={showAddonPanel ? addonPanelDefaultSize : 1}
          defaultSize={addonPanelDefaultSize}
          onDragStarted={this.onDragStart}
          onDragFinished={this.onDragEnd}
          onChange={size => this.onResize('addonPanel', addonPanelInRight ? 'right' : 'down', size)}
        >
          <ContentPanel {...{ addonPanelInRight, storiesPanelOnTop }}>
            {/*
              When resizing panels, the drag event breaks if the cursor
              moves over the iframe. Show an overlay div over iframe
              at drag start and hide it when the drag ends.
            */}
            <DragBlockOverlay isDragging={isDragging} />
            <PreviewWrapper
              fullscreen={goFullScreen}
              innerRef={ref => {
                this.previewPanelRef = ref;
              }}
            >
              <Preview />
              <Dimensions {...previewPanelDimensions} />
            </PreviewWrapper>
          </ContentPanel>
          <AddonPanelWrapper {...{ showAddonPanel, addonPanelInRight }}>
            <AddonPanel />
          </AddonPanelWrapper>
        </SplitPane>
      </SplitPane>
    );
  }
}

Layout.propTypes = {
  showStoriesPanel: PropTypes.bool.isRequired,
  showAddonPanel: PropTypes.bool.isRequired,
  goFullScreen: PropTypes.bool.isRequired,
  storiesPanel: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  addonPanel: PropTypes.func.isRequired,
  addonPanelInRight: PropTypes.bool.isRequired,
};

export default Layout;
