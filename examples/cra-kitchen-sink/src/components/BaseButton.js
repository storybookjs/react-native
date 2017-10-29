import React from 'react';
import PropTypes from 'prop-types';

/** BaseButton component description imported from comments inside the component file */
const BaseButton = ({ disabled, label, onClick }) => (
  <button disabled={disabled} onClick={onClick}>
    {label}
  </button>
);

BaseButton.defaultProps = {
  disabled: false,
  onClick: () => {},
};

BaseButton.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
};

export default BaseButton;
