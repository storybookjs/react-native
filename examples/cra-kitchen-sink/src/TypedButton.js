// @flow
import React from 'react';

type PropsType = {
    /** Boolean indicating wether the button should render as disabled */
    disabled?: boolean,
	/** button label. */
	label: string,
	/** onClick handler */
	onClick?: Function,
	/** component styles */
	style?: {}
};

/** Button component description */
const TypedButton = ({ disabled, label, style, onClick }: PropsType) => (
  <button disabled={disabled} style={style} onClick={onClick}>
    {label}
  </button>
);

TypedButton.defaultProps = {
    disabled: false,
	onClick: () => {},
	style: {},
};

export default TypedButton;
