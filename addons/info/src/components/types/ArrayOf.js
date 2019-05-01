/* eslint-disable import/no-cycle */
import React from 'react';

import PrettyPropType from './PrettyPropType';
import { TypeInfo, getPropTypes } from './proptypes';

const ArrayOf = ({ propType }) => (
  <span>
    <span>[</span>
    <span>
      <PrettyPropType propType={getPropTypes(propType)} />
    </span>
    <span>]</span>
  </span>
);

ArrayOf.propTypes = {
  propType: TypeInfo.isRequired,
};

export default ArrayOf;
