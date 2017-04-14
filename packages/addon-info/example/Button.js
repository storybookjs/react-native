import PropTypes from 'prop-types';
import React from 'react';

const Button = ({ disabled, label, style, onClick }) => (
  <button disabled={disabled} onClick={onClick}>
    {label}
  </button>
);

Object.assign(Button, {
  displayName: 'Button',
  propTypes: {
    label: PropTypes.string.isRequired,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  },
});

export default Button;
