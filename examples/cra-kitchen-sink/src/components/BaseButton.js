import React from 'react';
import PropTypes from 'prop-types';

/** BaseButton component description imported from comments inside the component file */
const BaseButton = ({ disabled, label, onClick, style }) => (
  <button disabled={disabled} onClick={onClick} style={style}>
    {label}
  </button>
);

BaseButton.defaultProps = {
  disabled: false,
  onClick: () => {},
  style: {},
};

BaseButton.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /** Custom styles */
  style: PropTypes.shape({}),
};

export default BaseButton;
