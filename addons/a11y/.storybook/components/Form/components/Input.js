import React, { PropTypes } from 'react';

function Input({ id, value, type, placeholder }) {
  return (
    <input
      id={id}
      value={value}
      placeholder={placeholder}
      type={type}
    />
  );
}

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'password']),
  id: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
}

export default Input;
