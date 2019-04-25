/* eslint-disable import/no-cycle */
import React from 'react';

import PrettyPropType from './PrettyPropType';
import { TypeInfo, getPropTypes } from './proptypes';

const ObjectOf = ({ propType }) => (
  <span>
    {'{[<key>]: '}
    <PrettyPropType propType={getPropTypes(propType)} />
    {'}'}
  </span>
);

ObjectOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default ObjectOf;
