import React from 'react';
import ReactModal from 'react-modal';

const commandStyle = {
  backgroundColor: '#eee',
  padding: '2px 7px',
  borderRadius: 2,
  lineHeight: '36px',
  marginRight: '9px',
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
    width: 440,
    marginLeft: -220,
    border: 'none',
    overflow: 'visible',
    fontFamily: 'sans-serif',
    fontSize: 14,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.74902)',
  },
};

export const Keys = ({ shortcutKeys }) => {
  // if we have only one key combination for a shortcut
  if (shortcutKeys.length === 1) {
    return (
      <span><b style={commandStyle}>{shortcutKeys[0]}</b></span>
    );
  }

  // if we have multiple key combinations for a shortcut
  let keys = shortcutKeys.map((key, index, arr) => {
    return (
        <span key={index}>
          <b style={commandStyle}>{key}</b>
          {/*add / & space if it is not a last key combination*/}
          {((arr.length - 1) !== index) ? <span>/ &nbsp;</span> : ''}
        </span>
      );
  });

  return (
    <span>{keys}</span>
  );
}

export const Content = ({ appShortcuts }) => {
  let shortcuts = appShortcuts.map((shortcut, index) => {
    return (
      <div key = {index}>
        <Keys shortcutKeys = {shortcut.keys} />
        {shortcut.name}
      </div>
    );
  });

  return (
    <div>
      <h4 style={h4Style}>Keyboard Shortcuts</h4>
      {shortcuts}
    </div>
  );
}

export const ShortcutsHelp = ({ isOpen, onClose, shortcuts }) => (
  <ReactModal
    isOpen = {isOpen}
    onRequestClose = {onClose}
    style = {modalStyles}
  >
    <Content appShortcuts = {shortcuts} />
  </ReactModal>
);

ShortcutsHelp.propTypes = {
  isOpen: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  shortcuts: React.PropTypes.array.isRequired,
};

export default ShortcutsHelp;
