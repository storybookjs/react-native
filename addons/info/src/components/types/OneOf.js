import React from 'react';
import { TypeInfo, getPropTypes } from './proptypes';

const OneOf = ({ propType }) => (
  <span>
    {getPropTypes(propType)
      .map(({ value }) => value)
      .join(' | ')}
  </span>
);

OneOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default OneOf;
