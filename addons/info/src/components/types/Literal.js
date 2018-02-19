import React from 'react';
import { TypeInfo } from './proptypes';

const Literal = ({ propType }) => <span>{propType.value}</span>;

Literal.propTypes = {
  propType: TypeInfo.isRequired,
};

export default Literal;
