import React from 'react';
import { TypeInfo } from './proptypes';

const InstanceOf = ({ propType }) =>
  <span>
    {propType.value}
  </span>;

InstanceOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default InstanceOf;
