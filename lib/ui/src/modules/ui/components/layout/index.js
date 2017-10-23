import { document, localStorage, window } from 'global';
import PropTypes from 'prop-types';
import React from 'react';
import SplitPane from 'react-split-pane';

import USplit from './usplit';
import Dimensions from './dimensions';

const rootStyle = {
  height: '100vh',
  backgroundColor: '#F7F7F7',
};

const leftPanelStyle = leftPanelOnTop => ({
  width: '100%',
  display: 'flex',
  flexDirection: leftPanelOnTop ? 'column' : 'row',
  alignItems: 'stretch',
  paddingRight: leftPanelOnTop ? 10 : 0,
});

const downPanelStyle = downPanelInRight => ({
  display: 'flex',
  flexDirection: downPanelInRight ? 'row' : 'column',
  alignItems: 'stretch',
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: downPanelInRight ? '5px 10px 10px 0' : '0px 10px 10px 0',
  boxSizing: 'border-box',
});

const resizerCursor = isVert => (isVert ? 'col-resize' : 'row-resize');

const storiesResizerStyle = (showLeftPanel, leftPanelOnTop) => ({
  cursor: showLeftPanel ? resizerCursor(!leftPanelOnTop) : undefined,
  height: leftPanelOnTop ? 10 : 'auto',
  width: leftPanelOnTop ? '100%' : 10,
  zIndex: 1,
});

const addonResizerStyle = (showDownPanel, downPanelInRight) => ({
  cursor: showDownPanel ? resizerCursor(downPanelInRight) : undefined,
  height: downPanelInRight ? '100%' : 10,
  width: downPanelInRight ? 10 : '100%',
  zIndex: 1,
});

const contentPanelStyle = (downPanelInRight, leftPanelOnTop) => ({
  position: 'absolute',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  padding: downPanelInRight ? '10px 2px 10px 0' : '10px 10px 2px 0',
  paddingTop: leftPanelOnTop ? 0 : 10,
});

const normalPreviewStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFF',
  border: '1px solid #ECECEC',
  borderRadius: 4,
};

const fullScreenPreviewStyle = {
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: '0px',
  zIndex: 1,
  backgroundColor: '#FFF',
  height: '100%',
  width: '100%',
  border: 0,
  margin: 0,
  padding: 0,
  overflow: 'auto',
  webkitOverflowScrolling: 'touch',
};

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

const onDragStart = () => document.body.classList.add('dragging');

const onDragEnd = () => document.body.classList.remove('dragging');

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

const conditionalRender = (condition, positive, negative) => (condition ? positive() : negative());

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.layerSizes = getSavedSizes(defaultSizes);

    this.state = {
      previewPanelDimensions: {
        height: 0,
        width: 0,
      },
    };

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize(pane, mode) {
    return size => {
      this.layerSizes[pane][mode] = size;
      saveSizes(this.layerSizes);

      const { clientWidth, clientHeight } = this.previewPanelRef;

      this.setState({
        previewPanelDimensions: {
          width: clientWidth,
          height: clientHeight,
        },
      });
    };
  }

  render() {
    const {
      goFullScreen,
      showLeftPanel,
      showDownPanel,
      downPanelInRight,
      downPanel,
      leftPanel,
      preview,
    } = this.props;
    const { previewPanelDimensions } = this.state;

    const leftPanelOnTop = false;

    let previewStyle = normalPreviewStyle;

    if (goFullScreen) {
      previewStyle = fullScreenPreviewStyle;
    }

    const sizes = getSavedSizes(this.layerSizes);

    const leftPanelDefaultSize = !leftPanelOnTop ? sizes.storiesPanel.left : sizes.storiesPanel.top;
    const downPanelDefaultSize = !downPanelInRight ? sizes.addonPanel.down : sizes.addonPanel.right;

    const addonSplit = downPanelInRight ? 'vertical' : 'horizontal';
    const storiesSplit = leftPanelOnTop ? 'horizontal' : 'vertical';

    return (
      <div style={rootStyle}>
        <SplitPane
          split={storiesSplit}
          allowResize={showLeftPanel}
          minSize={150}
          maxSize={-400}
          size={showLeftPanel ? leftPanelDefaultSize : 1}
          defaultSize={leftPanelDefaultSize}
          resizerStyle={storiesResizerStyle(showLeftPanel, leftPanelOnTop)}
          onDragStarted={onDragStart}
          onDragFinished={onDragEnd}
          onChange={this.onResize('storiesPanel', leftPanelOnTop ? 'top' : 'left')}
        >
          {conditionalRender(
            showLeftPanel,
            () => (
              <div style={leftPanelStyle(leftPanelOnTop)}>
                <div style={{ flexGrow: 1, height: '100%', width: '100%' }}>{leftPanel()}</div>
                <USplit shift={5} split={storiesSplit} />
              </div>
            ),
            () => <span />
          )}

          <SplitPane
            split={addonSplit}
            allowResize={showDownPanel}
            primary="second"
            minSize={downPanelInRight ? 200 : 100}
            maxSize={-200}
            size={showDownPanel ? downPanelDefaultSize : 1}
            defaultSize={downPanelDefaultSize}
            resizerStyle={addonResizerStyle(showDownPanel, downPanelInRight)}
            onDragStarted={onDragStart}
            onDragFinished={onDragEnd}
            onChange={this.onResize('addonPanel', downPanelInRight ? 'right' : 'down')}
          >
            <div style={contentPanelStyle(downPanelInRight, leftPanelOnTop)}>
              <div
                style={previewStyle}
                ref={ref => {
                  this.previewPanelRef = ref;
                }}
              >
                {preview()}
              </div>
              <Dimensions {...previewPanelDimensions} />
            </div>
            {conditionalRender(
              showDownPanel,
              () => (
                <div style={downPanelStyle(downPanelInRight)}>
                  <USplit shift={-5} split={addonSplit} />
                  {downPanel()}
                </div>
              ),
              () => <span />
            )}
          </SplitPane>
        </SplitPane>
      </div>
    );
  }
}

Layout.propTypes = {
  showLeftPanel: PropTypes.bool.isRequired,
  showDownPanel: PropTypes.bool.isRequired,
  goFullScreen: PropTypes.bool.isRequired,
  leftPanel: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  downPanel: PropTypes.func.isRequired,
  downPanelInRight: PropTypes.bool.isRequired,
};

export default Layout;
