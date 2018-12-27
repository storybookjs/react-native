import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const LEFT_BUTTON = 0;

const isPlainLeftClick = e =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

const cancelled = (e, cb = () => {}) => {
  if (isPlainLeftClick(e)) {
    e.preventDefault();
    cb(e);
  }
};

const A = styled.a({
  color: 'inherit',
});
A.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

const CancelledLink = ({ children, onClick, ...rest }) => (
  <A {...rest} onClick={e => cancelled(e, onClick)}>
    {children}
  </A>
);
CancelledLink.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};
CancelledLink.defaultProps = {
  onClick: () => {},
};

const Link = ({ cancel, children, ...rest }) =>
  cancel ? <CancelledLink {...rest}>{children}</CancelledLink> : <A {...rest}>{children}</A>;
Link.propTypes = {
  cancel: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.shape({}),
};
Link.defaultProps = {
  cancel: true,
  className: undefined,
  style: undefined,
};

export default Link;
