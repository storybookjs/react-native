import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import BaseButton from './BaseButton';

const ForwardedRefButton = forwardRef((props, ref) => <BaseButton {...props} forwardedRef={ref} />);

ForwardedRefButton.defaultProps = {
  disabled: false,
  onClick: () => {},
  style: {},
};

ForwardedRefButton.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /** Custom styles */
  style: PropTypes.shape({}),
};

export default ForwardedRefButton;
