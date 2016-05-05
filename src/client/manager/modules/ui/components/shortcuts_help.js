import React from 'react';
import ReactModal from 'react-modal';

const commandStyle = {
  backgroundColor: '#eee',
  padding: '2px 6px',
  borderRadius: 2,
  lineHeight: '36px',
  marginRight: '5px',
};

const h4Style = {
  marginTop: 0,
  textAlign: 'center',
};

const modalStyles = {
  content: {
    left: '50%',
    bottom: 'initial',
    right: 'initial',
    width: 350,
    marginLeft: -175,
    border: 'none',
    overflow: 'visible',
    fontFamily: 'sans-serif',
    fontSize: 14,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.74902)',
  },
};

export const Content = () => (
  <div>
    <h4 style={h4Style}>Keyboard Shortcuts</h4>
      <div>
        <b style={commandStyle}>&#8984; &#8679; F</b> / &nbsp;
        <b style={commandStyle}>&#8963; &#8679; F</b>
        Toggle Fullscreen Mode
      </div>
      <div>
        <b style={commandStyle}>&#8984; &#8679; L</b> / &nbsp;
        <b style={commandStyle}>&#8963; &#8679; L</b>
        Toggle Left Panel
      </div>
      <div>
        <b style={commandStyle}>&#8984; &#8679; D</b> / &nbsp;
        <b style={commandStyle}>&#8963; &#8679; D</b>
        Toggle Down Panel
      </div>
  </div>
);

export const ShortcutsHelp = ({ isOpen, onClose }) => (
  <ReactModal
    isOpen = {isOpen}
    onRequestClose = {onClose}
    style = {modalStyles}
  >
    <Content />
  </ReactModal>
);

ShortcutsHelp.propTypes = {
  isOpen: React.PropTypes.bool,
  onClose: React.PropTypes.func,
};

export default ShortcutsHelp;
