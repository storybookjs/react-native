import React, { FC } from 'react';

interface ButtonProps {
  /**
   * Simple click handler
   */
  onClick?: () => void;

  /**
   * Is primary?
   */
  primary?: boolean;
}

/**
 * The world's most _basic_ button
 */
export const Button: FC<ButtonProps> = ({ children, onClick }) => (
  <button onClick={onClick} type="button">
    {children}
  </button>
);

Button.defaultProps = {
  primary: true,
};
