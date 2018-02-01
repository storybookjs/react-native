// @flow
import React from 'react';

type PropsType = {
  /** A multi-type prop to be rendered in the button */
  label: string | number,
  /** Function to be called when the button is clicked */
  onClick?: Function,
  /** Boolean representing whether the button is disabled */
  disabled?: boolean,
};

/** FlowTypeButton component description imported from comments inside the component file */
const FlowTypeButton = ({ label, onClick, disabled }: PropsType) => (
  <button onClick={onClick} disabled={disabled}>
    {label}
  </button>
);

FlowTypeButton.defaultProps = {
  disabled: false,
  onClick: () => {},
};

export default FlowTypeButton;
