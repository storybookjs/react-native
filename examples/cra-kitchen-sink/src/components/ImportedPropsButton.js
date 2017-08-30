import React from 'react';
import DocgenButton from './DocgenButton';

/** Button component description */
const ImportedPropsButton = ({ disabled, label, onClick }) =>
  <button disabled={disabled} onClick={onClick}>
    {label}
  </button>;

ImportedPropsButton.defaultProps = DocgenButton.defaultProps;

ImportedPropsButton.propTypes = DocgenButton.propTypes;

export default ImportedPropsButton;
