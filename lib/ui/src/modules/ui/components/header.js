import PropTypes from 'prop-types';
import React from 'react';
import { baseFonts } from '@storybook/components';
// import isMobileDevice from '../libs/is_mobile_device';

const wrapperStyle = isMobileDevice => ({
  background: isMobileDevice ? 'none' : '#F7F7F7',
  margin: isMobileDevice ? '10px 0' : '0 0 10px',
  display: 'flex',
});

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

const iconStyle = isMobileDevice => ({
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
  margin: isMobileDevice ? '0 15px' : '0 0 0 5px',
  backgroundColor: 'inherit',
  outline: 0,
  width: 30,
  flexShrink: 0,
});

const burgerIconStyle = {
  ...iconStyle(true),
  paddingBottom: 2,
};

const linkStyle = isMobileDevice => ({
  textDecoration: 'none',
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: isMobileDevice ? 'none' : '1px solid rgb(193, 193, 193)',
  borderRadius: 2,
});

const Header = ({ openShortcutsHelp, onBurgerButtonClick, name, url, isMobileDevice }) => (
  <div style={wrapperStyle(isMobileDevice)}>
    {isMobileDevice && (
      <button style={burgerIconStyle} onClick={onBurgerButtonClick}>
        ☰
      </button>
    )}
    <a style={linkStyle(isMobileDevice)} href={url} target="_blank" rel="noopener noreferrer">
      <h3 style={headingStyle}>{name}</h3>
    </a>
    <button style={iconStyle(isMobileDevice)} onClick={openShortcutsHelp}>
      ⌘
    </button>
  </div>
);

Header.defaultProps = {
  openShortcutsHelp: null,
  onBurgerButtonClick: null,
  name: '',
  url: '',
  isMobileDevice: false,
};

Header.propTypes = {
  openShortcutsHelp: PropTypes.func,
  onBurgerButtonClick: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string,
  isMobileDevice: PropTypes.bool,
};

export default Header;
