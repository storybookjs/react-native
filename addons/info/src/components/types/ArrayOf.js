import React from 'react';

import PrettyPropType from './PrettyPropType';
import { TypeInfo } from './proptypes';

const ArrayOf = ({ propType }) => (
  <span>
    <span>[</span>
    <span>
      <PrettyPropType propType={propType.value} />
    </span>
    <span>]</span>
  </span>
);

ArrayOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default ArrayOf;
