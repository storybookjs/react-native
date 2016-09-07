import React from 'react';

const buttonStyles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
};

const Button = ({ onClick, style, color, width, children, disabled }) => (
  <button
    style={{ ...buttonStyles, ...{ backgroundColor: color, width: `${width}px` }, ...style }}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  color: React.PropTypes.string,
  width: React.PropTypes.number,
  disabled: React.PropTypes.bool,
  style: React.PropTypes.object,
};

Button.defaultProps = {
  color: '#fff',
  children: 'Hello',
  width: 70,
  disabled: false,
};

export default Button;
