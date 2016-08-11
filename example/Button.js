import React from 'react';

const Button = ({ disabled, label, style, onClick }) => (
  <button disabled={disabled} onClick={onClick}>
    {label}
  </button>
);

Object.assign(Button, {
  displayName: 'Button',
  propTypes: {
    label: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
  },
});

export default Button;
