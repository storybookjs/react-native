import React from 'react';
import { TypeInfo } from './proptypes';

const joinValues = propType => propType.value.map(({ value }) => value).join(' | ');

const OneOf = ({ propType }) => (
  <span>{`oneOf ${Array.isArray(propType.value) ? joinValues(propType) : propType.value}`}</span>
);

OneOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default OneOf;
