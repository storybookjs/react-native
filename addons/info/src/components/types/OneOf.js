import React from 'react';
import { TypeInfo, getPropTypes } from './proptypes';

const joinValues = propTypes => propTypes.map(({ value }) => value).join(' | ');

const OneOf = ({ propType }) => {
  const propTypes = getPropTypes(propType);
  return <span>{`oneOf ${Array.isArray(propTypes) ? joinValues(propTypes) : propTypes}`}</span>;
};

OneOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default OneOf;
