import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
    zIndex: 1,
  },
};

// manage two separate shortcut keys for
// 'mac' & other (windows, linux) platforms
export function getShortcuts(platform) {
  // if it is mac platform
  if (platform && platform.indexOf('mac') !== -1) {
    return [
      { name: 'Show Search Box', keys: ['⌘ ⇧ O', '⌃ ⇧ O'] },
      { name: 'Toggle Addon panel position', keys: ['⌘ ⇧ G', '⌃ ⇧ G'] },
      { name: 'Toggle Fullscreen Mode', keys: ['⌘ ⇧ F', '⌃ ⇧ F'] },
      { name: 'Toggle Stories Panel', keys: ['⌘ ⇧ X', '⌃ ⇧ X'] },
      { name: 'Toggle Addon panel', keys: ['⌘ ⇧ C', '⌃ ⇧ C'] },
      { name: 'Next Story', keys: ['⌘ ⇧ →', '⌃ ⇧ →'] },
      { name: 'Previous Story', keys: ['⌘ ⇧ ←', '⌃ ⇧ ←'] },
    ];
  }

  return [
    { name: 'Show Search Box', keys: ['Ctrl + Shift + O'] },
    { name: 'Toggle Addon panel position', keys: ['Ctrl + Shift + G'] },
    { name: 'Toggle Fullscreen Mode', keys: ['Ctrl + Shift + F'] },
    { name: 'Toggle Stories Panel', keys: ['Ctrl + Shift + X'] },
    { name: 'Toggle Addon panel', keys: ['Ctrl + Shift + C'] },
    { name: 'Next Story', keys: ['Ctrl + Shift + →'] },
    { name: 'Previous Story', keys: ['Ctrl + Shift + ←'] },
  ];
}

export const Keys = ({ shortcutKeys }) => {
  // if we have only one key combination for a shortcut
  if (shortcutKeys.length === 1) {
    return (
      <span>
        <b style={commandStyle}>{shortcutKeys[0]}</b>
      </span>
    );
  }

  // if we have multiple key combinations for a shortcut
  const keys = shortcutKeys.map((key, index, arr) => (
    <span key={key}>
      <b style={commandStyle}>{key}</b>
      {/* add / & space if it is not a last key combination */}
      {arr.length - 1 !== index ? <span>/ &nbsp;</span> : ''}
    </span>
  ));

  return <span>{keys}</span>;
};

Keys.propTypes = {
  shortcutKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const Shortcuts = ({ appShortcuts }) => {
  const shortcuts = appShortcuts.map(shortcut => (
    <div key={shortcut.name}>
      <Keys shortcutKeys={shortcut.keys} />
      {shortcut.name}
    </div>
  ));

  return (
    <div>
      <h4 style={h4Style}>Keyboard Shortcuts</h4>
      {shortcuts}
    </div>
  );
};

Shortcuts.propTypes = {
  appShortcuts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      keys: PropTypes.array,
    })
  ).isRequired,
};

// eslint-disable-next-line react/prefer-stateless-function
export class ShortcutsHelp extends Component {
  render() {
    const { isOpen, onClose, platform } = this.props;
    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={modalStyles}
        contentLabel="Shortcuts"
      >
        <Shortcuts appShortcuts={getShortcuts(platform)} />
      </ReactModal>
    );
  }
}

ShortcutsHelp.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  platform: PropTypes.string.isRequired,
};
ShortcutsHelp.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default ShortcutsHelp;
