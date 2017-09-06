import React from 'react';
import { TypeInfo } from './proptypes';

const Signature = ({ propType }) => <span>{propType.raw}</span>;

Signature.propTypes = {
  propType: TypeInfo.isRequired,
};

export default Signature;
