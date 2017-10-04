import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '@storybook/components';

const wrapperStyle = {
  background: '#F7F7F7',
  marginBottom: 10,
  display: 'flex',
};

const headingStyle = {
  ...baseFonts,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontSize: '12px',
  fontWeight: 'bolder',
  color: '#828282',
  textAlign: 'center',
  cursor: 'pointer',
  padding: '5px',
  margin: 0,
  overflow: 'hidden',
};

const shortcutIconStyle = {
  textTransform: 'uppercase',
  fontSize: 12,
  fontWeight: 'bolder',
  color: 'rgb(130, 130, 130)',
  border: '1px solid rgb(193, 193, 193)',
  textAlign: 'center',
  borderRadius: 2,
  cursor: 'pointer',
  display: 'inlineBlock',
  padding: 0,
  margin: '0 0 0 5px',
  backgroundColor: 'inherit',
  outline: 0,
  width: 30,
  flexShrink: 0,
};

const linkStyle = {
  textDecoration: 'none',
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgb(193, 193, 193)',
  borderRadius: 2,
};

const Header = ({ openShortcutsHelp, name, url }) => (
  <div style={wrapperStyle}>
    <a style={linkStyle} href={url} target="_blank" rel="noopener noreferrer">
      <h3 style={headingStyle}>{name}</h3>
    </a>
    <button style={shortcutIconStyle} onClick={openShortcutsHelp}>
      ⌘
    </button>
  </div>
);

Header.defaultProps = {
  openShortcutsHelp: null,
  name: '',
  url: '',
};

Header.propTypes = {
  openShortcutsHelp: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string,
};

export default Header;
