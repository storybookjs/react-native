import React from 'react';
import { TypeInfo } from './proptypes';

const OneOf = ({ propType }) => <span>{propType.value.map(({ value }) => value).join(' | ')}</span>;

OneOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default OneOf;
