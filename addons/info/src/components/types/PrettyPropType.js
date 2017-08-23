import PropTypes from 'prop-types';
import React from 'react';

import ObjectType from './ObjectType';
import OneOfType from './OneOfType';
import ArrayOf from './ArrayOf';
import ObjectOf from './ObjectOf';

import { TypeInfo } from './proptypes';

const PrettyPropType = ({ propType, depth }) => {
  if (!propType) {
    return <span>unknown</span>;
  }

  const { name } = propType || {};

  if (name === 'shape') {
    return <ObjectType propType={propType} depth={depth} />;
  }

  if (name === 'union') {
    return <OneOfType propType={propType} />;
  }

  if (name === 'arrayOf') {
    return <ArrayOf propType={propType} />;
  }

  if (name === 'objectOf') {
    return <ObjectOf propType={propType} />;
  }

  // Rest are just simple strings
  let display;

  switch (name) {
    case 'object':
      display = '{}';
      break;
    case 'enum':
      display = propType.value.map(({ value }) => value).join(' | ');
      break;
    case 'instanceOf':
      display = propType.value;
      break;
    case 'signature':
      display = propType.raw;
      break;
    default:
      display = name;
  }

  return (
    <span>
      {display}
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
