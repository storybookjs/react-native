import React from 'react';

import PrettyPropType from './PrettyPropType';
import { TypeInfo } from './proptypes';

const OneOfType = ({ propType }) => {
  const { length } = propType.value;
  return (
    <span>
      {propType.value
        .map((value, i) => {
          const key = `${value.name}${value.value ? `-${value.value}` : ''}`;
          return [
            <PrettyPropType key={key} propType={value} />,
            i < length - 1 ? <span key={`${key}-separator`}> | </span> : null,
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
