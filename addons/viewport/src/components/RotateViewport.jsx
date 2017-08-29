import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './styles';

export function RotateViewport({ active, ...props }) {
  const disabledStyles = props.disabled ? styles.disabled : {};
  const actionStyles = {
    ...styles.action,
    ...disabledStyles,
  };
  return (
    <div style={styles.row}>
      <label style={styles.label}>Rotate</label>
      <button {...props} style={actionStyles}>
        {active ? 'Vertical' : 'Landscape'}
      </button>
    </div>
  );
}

RotateViewport.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

RotateViewport.defaultProps = {
  disabled: true,
  active: false,
};
