import React from 'react';

const buttonStyles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
};

const Button = ({ onClick, style, color = '#FFFFFF', width = 70, children = 'Button', disabled = false }) => (
  <button
    style={{ ...buttonStyles, ...style, ...{ backgroundColor: color, width: `${width}px` } }}
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
  number: React.PropTypes.number,
  disabled: React.PropTypes.bool,
  style: React.PropTypes.object,
};

Button.defaultProps = {
  color: '#fff',
  children: 'Hello',
};

export default Button;
