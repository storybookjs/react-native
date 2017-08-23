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
    array: PropTypes.array,
    arrayOf: PropTypes.arrayOf(PropTypes.string),
    oneOf: PropTypes.oneOf(['foo', 'bar']),
    shape: PropTypes.shape({
      foo: PropTypes.string,
      bar: PropTypes.number,
    }),
    nestedArrayOf: PropTypes.arrayOf(PropTypes.shape({
      foo: PropTypes.shape({
        baz: PropTypes.string,
        bar: PropTypes.arrayOf({
          PropTypes.string
        }),
      }),
    })),
  },
});

export default Button;
