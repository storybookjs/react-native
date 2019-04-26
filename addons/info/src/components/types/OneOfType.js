/* eslint-disable import/no-cycle */
import React from 'react';

import PrettyPropType from './PrettyPropType';
import { TypeInfo, getPropTypes } from './proptypes';

const OneOfType = ({ propType }) => {
  const propTypes = getPropTypes(propType);
  return (
    <span>
      {propTypes
        .map((value, i) => {
          const key = `${value.name}${value.value ? `-${value.value}` : ''}`;
          return [
            <PrettyPropType key={key} propType={value} />,
            i < propTypes.length - 1 ? <span key={`${key}-separator`}> | </span> : null,
          ];
        })
        .reduce((acc, tuple) => acc.concat(tuple), [])}
    </span>
  );
};
OneOfType.propTypes = {
  propType: TypeInfo.isRequired,
};
export default OneOfType;
