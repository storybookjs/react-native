/* eslint-disable no-underscore-dangle */

import PropTypes from 'prop-types';
import React from 'react';
import PropVal from './PropVal';

const PropTypesMap = new Map();

Object.keys(PropTypes).forEach(typeName => {
  const type = PropTypes[typeName];

  PropTypesMap.set(type, typeName);
  PropTypesMap.set(type.isRequired, typeName);
});

const stylesheet = {
  propTable: {
    marginLeft: -10,
    borderSpacing: '10px 5px',
    borderCollapse: 'separate',
  },
};

export default function PropTable(props) {
  const { type, maxPropObjectKeys, maxPropArrayLength, maxPropStringLength } = props;

  if (!type) {
    return null;
  }

  const accumProps = {};

  if (type.propTypes) {
    Object.keys(type.propTypes).forEach(property => {
      const typeInfo = type.propTypes[property];
      const required = typeInfo.isRequired === undefined ? 'yes' : 'no';
      const description =
        type.__docgenInfo && type.__docgenInfo.props && type.__docgenInfo.props[property]
          ? type.__docgenInfo.props[property].description
          : null;
      let propType = PropTypesMap.get(typeInfo) || 'other';

      if (propType === 'other') {
        if (
          type.__docgenInfo &&
          type.__docgenInfo.props &&
          type.__docgenInfo.props[property] &&
          type.__docgenInfo.props[property].type
        ) {
          propType = type.__docgenInfo.props[property].type.name;
        }
      }

      accumProps[property] = { property, propType, required, description };
    });
  }

  if (type.defaultProps) {
    Object.keys(type.defaultProps).forEach(property => {
      const value = type.defaultProps[property];

      if (value === undefined) {
        return;
      }

      if (!accumProps[property]) {
        accumProps[property] = { property };
      }

      accumProps[property].defaultValue = value;
    });
  }

  const array = Object.values(accumProps);

  if (!array.length) {
    return <small>No propTypes defined!</small>;
  }

  array.sort((a, b) => a.property > b.property);

  const propValProps = {
    maxPropObjectKeys,
    maxPropArrayLength,
    maxPropStringLength,
  };

  return (
    <table style={stylesheet.propTable}>
      <thead>
        <tr>
          <th>property</th>
          <th>propType</th>
          <th>required</th>
          <th>default</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        {array.map(row =>
          <tr key={row.property}>
            <td>
              {row.property}
            </td>
            <td>
              {row.propType}
            </td>
            <td>
              {row.required}
            </td>
            <td>
              {row.defaultValue === undefined
                ? '-'
                : <PropVal val={row.defaultValue} {...propValProps} />}
            </td>
            <td>
              {row.description}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

PropTable.displayName = 'PropTable';
PropTable.defaultProps = {
  type: null,
};
PropTable.propTypes = {
  type: PropTypes.func,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
};
