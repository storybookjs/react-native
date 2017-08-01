import React from 'react';
import PropTypes from 'prop-types';

/** Button component description */
const DocgenButton = ({ disabled, label, style, onClick }) =>
  <button disabled={disabled} style={style} onClick={onClick}>
    {label}
  </button>;

DocgenButton.defaultProps = {
  disabled: false,
  onClick: () => {},
  style: {},
};

DocgenButton.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /** component styles */
  style: PropTypes.shape,
};

export default DocgenButton;
