import React from 'react';
import { TypeInfo, getPropTypes } from './proptypes';

const InstanceOf = ({ propType }) => <span>{getPropTypes(propType)}</span>;

InstanceOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default InstanceOf;
