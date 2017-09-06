import PropTypes from 'prop-types';
import React from 'react';

import ObjectType from './ObjectType';
import Shape from './Shape';
import OneOfType from './OneOfType';
import ArrayOf from './ArrayOf';
import ObjectOf from './ObjectOf';
import OneOf from './OneOf';
import InstanceOf from './InstanceOf';
import Signature from './Signature';

import { TypeInfo } from './proptypes';

// propType -> Component map - these are a bit more complex prop types to display
const propTypeComponentMap = new Map([
  ['shape', Shape],
  ['union', OneOfType],
  ['arrayOf', ArrayOf],
  ['objectOf', ObjectOf],
  // Might be overkill to have below proptypes  as separate components *shrug*
  ['object', ObjectType],
  ['enum', OneOf],
  ['instanceOf', InstanceOf],
  ['signature', Signature],
]);

const PrettyPropType = props => {
  const { propType, depth } = props;
  if (!propType) {
    return <span>unknown</span>;
  }

  const { name } = propType || {};

  if (propTypeComponentMap.has(name)) {
    const Component = propTypeComponentMap.get(name);
    return <Component propType={propType} depth={depth} />;
  }

  // Otherwise, propType does not have a dedicated component, display proptype name by default
  return (
    <span>
      {name}
    </span>
  );
};

PrettyPropType.displayName = 'PrettyPropType';

PrettyPropType.defaultProps = {
  propType: null,
  depth: 1,
};

PrettyPropType.propTypes = {
  propType: TypeInfo,
  depth: PropTypes.number.isRequired,
};

export default PrettyPropType;
