import PropTypes from 'prop-types';
import React, { Component } from 'react';
import glamorous from 'glamorous';

import ReactModal from 'react-modal';
import { baseFonts } from '@storybook/components';

const Command = glamorous.b(
  ({ isLast, isFirst }) => {
    switch (true) {
      case isFirst && isLast: {
        return {
          borderRight: '0 none',
          borderRadius: 2,
          marginRight: 0,
        };
      }
      case isFirst: {
        return {
          borderRight: '1px solid silver',
          borderRadius: '2px 0 0 2px',
          marginRight: 0,
        };
      }
      case isLast: {
        return {
          borderRight: '0 none',
          borderRadius: '0 2px 2px 0',
          marginRight: 9,
        };
      }
      default: {
        return {
          borderRight: '0 none',
          borderRadius: 0,
          marginRight: 9,
        };
      }
    }
  },
  {
    padding: '2px 10px',
    backgroundColor: '#eee',
    lineHeight: '36px',
    minWidth: 50,
    display: 'inline-block',
    textAlign: 'center',
  }
);

const Title = glamorous.h4({
  marginTop: 0,
  textAlign: 'center',
});

const modalStyles = {
  content: {
    left: '50%',
    bottom: 'initial',
    right: 'initial',
    width: 440,
    marginLeft: -220,
    border: 'none',
    overflow: 'visible',
    ...baseFonts,
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
      { name: 'Toggle Addon panel', keys: ['⌘ ⇧ Z', '⌃ ⇧ Z'] },
      { name: 'Next Story', keys: ['⌘ ⇧ →', '⌃ ⇧ →'] },
      { name: 'Previous Story', keys: ['⌘ ⇧ ←', '⌃ ⇧ ←'] },
    ];
  }

  return [
    { name: 'Show Search Box', keys: ['Ctrl + Shift + O'] },
    { name: 'Toggle Addon panel position', keys: ['Ctrl + Shift + G'] },
    { name: 'Toggle Fullscreen Mode', keys: ['Ctrl + Shift + F'] },
    { name: 'Toggle Stories Panel', keys: ['Ctrl + Shift + X'] },
    { name: 'Toggle Addon panel', keys: ['Ctrl + Shift + Z'] },
    { name: 'Next Story', keys: ['Ctrl + Shift + →'] },
    { name: 'Previous Story', keys: ['Ctrl + Shift + ←'] },
  ];
}

export const Keys = ({ shortcutKeys }) => {
  // if we have only one key combination for a shortcut
  if (shortcutKeys.length === 1) {
    return <Command>{shortcutKeys[0]}</Command>;
  }

  // if we have multiple key combinations for a shortcut
  const keys = shortcutKeys.map((key, index, arr) => (
    <Command key={key} isLast={arr.length - 1 === index} isFirst={index === 0}>
      {key}
    </Command>
  ));

  return <span>{keys}</span>;
};

Keys.propTypes = {
  shortcutKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const Shortcuts = ({ appShortcuts }) => (
  <table>
    <Title>Keyboard Shortcuts</Title>
    {appShortcuts.map(shortcut => (
      <tr key={shortcut.name}>
        <td>
          <Keys shortcutKeys={shortcut.keys} />
        </td>
        <td>{shortcut.name}</td>
      </tr>
    ))}
  </table>
);

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
