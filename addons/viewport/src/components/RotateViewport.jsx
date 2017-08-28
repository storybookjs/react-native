import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as styles from './styles';

export class RotateViewport extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
  };

  render() {
    const { active, ...props } = this.props;

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
}
