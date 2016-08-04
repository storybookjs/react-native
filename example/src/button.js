import React from 'react';

const buttonStyles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
};

const Button = ({ onClick, style, color = '#FFFFFF', children = 'Button' }) => {
  console.log("style is --->", style);
  return <button
    style={{ ...buttonStyles, ...style, ...{ backgroundColor: color } }}
    onClick={onClick}
  >
    {children}
  </button>
};

Button.propTypes = {
  children: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  color: React.PropTypes.string,
  style: React.PropTypes.object,
};

Button.defaultProps = {
  color: '#fff',
  children: 'Hello',
};

export default Button;
