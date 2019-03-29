import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import BaseButton from './BaseButton';

const ForwardedRefButtonWDisplayName = forwardRef((props, ref) => (
  <BaseButton {...props} forwardedRef={ref} />
));

ForwardedRefButtonWDisplayName.defaultProps = {
  disabled: false,
  onClick: () => {},
  style: {},
};

ForwardedRefButtonWDisplayName.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /** Custom styles */
  style: PropTypes.shape({}),
};

ForwardedRefButtonWDisplayName.displayName = 'ButtonDisplayName';

export default ForwardedRefButtonWDisplayName;
