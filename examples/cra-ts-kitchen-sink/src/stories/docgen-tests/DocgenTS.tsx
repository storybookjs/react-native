/* eslint-disable react/button-has-type */
import React, { FC, FunctionComponent, SyntheticEvent } from 'react';

interface ButtonProps {
  /**
   * onClick description
   */
  onClick?: (e: SyntheticEvent) => void;
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
