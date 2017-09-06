import React from 'react';
import { TypeInfo } from './proptypes';

const Enum = ({ propType }) => <span>{propType.value.map(({ value }) => value).join(' | ')}</span>;

Enum.propTypes = {
  propType: TypeInfo.isRequired,
};
