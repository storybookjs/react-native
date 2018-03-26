import PropTypes from 'prop-types';
import React from 'react';

const Button = ({ disabled, label, onClick }) => (
  <button disabled={disabled} onClick={onClick}>
    {label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  disabled: false,
  onClick() {},
};

export default Button;
