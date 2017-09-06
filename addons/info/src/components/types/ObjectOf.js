import React from 'react';

import PrettyPropType from './PrettyPropType';
import { TypeInfo } from './proptypes';

const ObjectOf = ({ propType }) => (
  <span>
    {'{[<key>]: '}
    <PrettyPropType propType={propType.value} />
    {'}'}
  </span>
);

ObjectOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default ObjectOf;
