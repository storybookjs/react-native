import PropTypes from 'prop-types';
import React from 'react';

import VSplit from './vsplit';
import HSplit from './hsplit';
import USplit from './usplit';
import Dimensions from './dimensions';
import SplitPane from 'react-split-pane';

const rootStyle = {
  height: '100vh',
  backgroundColor: '#F7F7F7',
};

const leftPanelStyle = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
};

const downPanelStyle = downPanelInRight => ({
  display: 'flex',
  flexDirection: downPanelInRight ? 'row' : 'column',
  alignItems: 'stretch',
  // position: 'absolute',
  width: '100%',
  height: '100%',
  padding: downPanelInRight ? '5px 10px 10px 0' : '0px 10px 10px 0',
  boxSizing: 'border-box',
});

const addonResizerStyle = downPanelInRight => ({
  cursor: downPanelInRight ? 'col-resize' : 'row-resize',
  height: downPanelInRight ? '100%' : 10,
  width: downPanelInRight ? 10 : '100%',
  // marginTop: downPanelInRight ? 0 : -10,
  zIndex: 1,
})

const contentPanelStyle = downPanelInRight => ({
  position: 'absolute',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  padding: downPanelInRight ? '10px 2px 10px 0' : '10px 10px 2px 0',
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
  overflow: 'hidden',
};

const vsplit = <VSplit />;
const hsplit = <HSplit />;

const onDragStart = function() {
  document.body.classList.add('dragging');
};

const onDragEnd = function() {
  document.body.classList.remove('dragging');
};

const saveHeightPanel = h => {
  try {
    localStorage.setItem('splitPos', h);
    return true;
  } catch (e) {
    return false;
  }
};

const getSavedHeight = h => {
  try {
    return localStorage.getItem('splitPos');
  } catch (e) {
    return h;
  }
};

class Layout extends React.Component {
  constructor(props) {
    super(props);

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

  onResize() {
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

    const leftPanelDefaultSize = showLeftPanel ? 250 : 1;
    let downPanelDefaultSize = 1;
    if (showDownPanel) {
      downPanelDefaultSize = downPanelInRight ? 400 : 200;
    }

    const addonSplit = downPanelInRight ? 'vertical' : 'horizontal';
    const storiesSplit = leftPanelOnTop ? 'horizontal' : 'vertical';

    // Get the value from localStorage or user downPanelDefaultSize
    downPanelDefaultSize = getSavedHeight(downPanelDefaultSize);

    return (
      <div style={rootStyle}>
        <SplitPane
          split="vertical"
          minSize={150}
          maxSize={-400}
          defaultSize={leftPanelDefaultSize}
          resizerStyle={{
            cursor: 'col-resize',
            width: 10,
            zIndex: 1,
          }}
          onDragStarted={onDragStart}
          onDragFinished={onDragEnd}
          onChange={this.onResize}
        >
          <div style={leftPanelStyle}>
            <div style={{ flexGrow: 1 }}>
              {showLeftPanel ? leftPanel() : null}
            </div>
            <USplit shift={5}/>
          </div>

          <SplitPane
            split={addonSplit}
            primary="second"
            minSize={downPanelInRight ? 200 : 100}
            maxSize={-200}
            defaultSize={downPanelDefaultSize}
            resizerChildren={downPanelInRight ? vsplit : hsplit}
            resizerStyle={addonResizerStyle(downPanelInRight)}
            onDragStarted={onDragStart}
            onDragFinished={onDragEnd}
            onChange={size => {
              saveHeightPanel(size);
              this.onResize();
            }}
          >
            <div style={contentPanelStyle(downPanelInRight)}>
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
            <div style={downPanelStyle(downPanelInRight)}>
              <USplit
                shift={-5}
                split={addonSplit}
              />
              {/*{downPanelInRight ? <USplit shift={-5}/> : hsplit}*/}
              {/*<div style={{ flexGrow: 1 }}>*/}
                {showDownPanel ? downPanel() : null}
              {/*</div>*/}
            </div>
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
