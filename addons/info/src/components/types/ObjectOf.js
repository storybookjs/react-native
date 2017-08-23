import React from 'react';

import PrettyPropType from './PrettyPropType';
import { TypeInfo } from './proptypes';

const ObjectOf = ({ propType }) =>
  <span>
    <span>
      {'{'}
    </span>
    <span />
    <span>
      {'[<key>]:'}
    </span>
    <span />
    <span>
      <PrettyPropType propType={propType.value} />
    </span>
    <span>
      {'}'}
    </span>
  </span>;

ObjectOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default ObjectOf;
