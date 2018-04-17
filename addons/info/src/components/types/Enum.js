import React from 'react';
import { TypeInfo, getPropTypes } from './proptypes';

const Enum = ({ propType }) => (
  <span>
    {getPropTypes(propType)
      .map(({ value }) => value)
      .join(' | ')}
  </span>
);

Enum.propTypes = {
  propType: TypeInfo.isRequired,
};
