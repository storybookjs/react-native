/* eslint-disable react/prefer-stateless-function */
import React, { FC, FunctionComponent } from 'react';

interface ButtonProps {
  /**
   * onClick description
   */
  onClick?: () => void;
}

/**
 * Button functional component (React.FC)
 */
export const ButtonReactFC: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
// @ts-ignore
ButtonReactFC.defaultProps = {
  onClick: null,
};

/**
 * Button functional component (FC)
 */
export const ButtonFC: FC<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
// @ts-ignore
ButtonFC.defaultProps = {
  onClick: null,
};

/**
 * Button functional component (FunctionComponent)
 */
export const ButtonFunctionComponent: FunctionComponent<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
// @ts-ignore
ButtonFunctionComponent.defaultProps = {
  onClick: null,
};
