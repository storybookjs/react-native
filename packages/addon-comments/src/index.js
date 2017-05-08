import PropTypes from 'prop-types';
import React from 'react';

const buttonStyles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
};

const Button = ({ children, onClick, style = {} }) => (
  <button style={{ ...buttonStyles, ...style }} onClick={onClick}>
    {children}
  </button>
);

Button.defaultProps = {
  onClick: () => {},
  style: {},
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default Button;
