import React from 'react';
import PropTypes from 'prop-types';

import Button from './button';

export default function ToggleButton(props) {
  const containerStyle = {
    transition: 'transform .2s ease',
    transform: props.toggled ? 'translateY(0px)' : 'translateY(-100%) translateY(-3px)',
    height: 16,
  };

  return (
    <Button onClick={props.onClick}>
      <div style={containerStyle}>
        <div style={{ marginBottom: 2 }}>Copied!</div>
        <div>Copy</div>
      </div>
    </Button>
  );
}

ToggleButton.propTypes = {
  onClick: PropTypes.func,
  toggled: PropTypes.bool,
};

ToggleButton.defaultProps = {
  onClick: () => {},
  toggled: false,
};
