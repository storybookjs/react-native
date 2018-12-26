import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.div(({ theme }) => ({
  margin: '0 0 10px',
  display: 'flex',
  ...theme.brand,
}));

const HeadingLink = styled.a(({ theme }) => ({
  textDecoration: 'none',
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: 2,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontSize: '12px',
  fontWeight: 'bolder',
  color: 'currentColor',
  textAlign: 'center',
  cursor: 'pointer',
  padding: '5px',
  margin: 0,
  overflow: 'hidden',
  ...theme.brandLink,
}));

const ShortHelpButton = styled.button({
  textTransform: 'uppercase',
  fontSize: 12,
  fontWeight: 'bolder',
  color: 'currentColor',
  border: '1px solid rgba(0, 0, 0, 0.1)',
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
});

const Header = ({ openShortcutsHelp, name, url, enableShortcutsHelp, isMobileDevice }) => (
  <Wrapper isMobileDevice={isMobileDevice}>
    <HeadingLink
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      dangerouslySetInnerHTML={{ __html: name }}
    />
    {enableShortcutsHelp && <ShortHelpButton onClick={openShortcutsHelp}>⌘</ShortHelpButton>}
  </Wrapper>
);

Header.defaultProps = {
  openShortcutsHelp: null,
  enableShortcutsHelp: true,
  name: '',
  url: '',
  isMobileDevice: false,
};

Header.propTypes = {
  openShortcutsHelp: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string,
  isMobileDevice: PropTypes.bool,
  enableShortcutsHelp: PropTypes.bool,
};

export default Header;
