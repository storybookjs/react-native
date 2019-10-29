import React, { FunctionComponent } from 'react';

interface Props {
  /**
   * Click event handler
   * @default null
   */
  onClick?: () => void;
}

const Button: FunctionComponent<Props> = ({ children, onClick }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

export default Button;
