import React, { PropTypes } from 'react';
import { ObjectLabel, ObjectRootLabel } from 'react-inspector';
import { CLASS_NAME_KEY, createFakeConstructor } from '../../util';

export default function NodeRenderer({ depth, name, data, isNonEnumerable }) {
  let obj;
  if (Object.prototype.toString.call(data) === '[object Object]' && data[CLASS_NAME_KEY]) {
    obj = createFakeConstructor(data);
  } else {
    obj = data;
  }

  return depth === 0 ? (
    <ObjectRootLabel name={name} data={obj} />
  ) : (
    <ObjectLabel name={name} data={obj} isNonEnumerable={isNonEnumerable} />
  );
}

NodeRenderer.propTypes = {
  depth: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  data: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  isNonEnumerable: PropTypes.bool,
};

NodeRenderer.defaultProps = {
  data: undefined,
  isNonEnumerable: false,
};
