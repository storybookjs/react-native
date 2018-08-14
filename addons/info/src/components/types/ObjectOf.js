import React from 'react';

// eslint-disable-next-line import/no-cycle
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
