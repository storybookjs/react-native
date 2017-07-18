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
  hasProperty: {
    marginLeft: 10
  },
  code: {
    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
  },
  block: {
    display: 'block'
  },
  propTable: {
    marginTop: 10,
    borderCollapse: 'collapse'
  },
  propTableCell: {
    border: '1px solid #ccc',
    padding: '2px 6px'
  }
};

const formatType = ({propType, type, property, required}) => {
  let result;

  if (type) {
    const PropertyLabel =
      property &&
      <span style={stylesheet.hasProperty}>
        {property}:{' '}
      </span>;

    if (propType === 'other') {
      return (result = type.name);
    } else if (type && propType === 'arrayOf') {
      return (
        <span style={property ? {...stylesheet.block, ...stylesheet.hasProperty} : {}}>
          {PropertyLabel}
          <span>[</span>
          <span>
            {formatType({
              parentType: propType,
              type: type.value,
              propType: type.value.name
            })}
          </span>
          <span>]</span>
        </span>
      );
    } else if (propType === 'enum') {
      return (
        <div>
          {type.value.map(({value}) => value).join(' | ')}
        </div>
      );
    } else if (propType === 'shape') {
      const values = Object.keys(type.value).map(property =>
        formatType({
          property,
          parentType: propType,
          type: type.value[property],
          propType: type.value[property].name,
          required: type.value[property].required
        })
      );

      return (
        <span style={property ? {...stylesheet.block, ...stylesheet.hasProperty} : {}}>
          {PropertyLabel}
          <span>
            {'{'}
          </span>
          {values.map(value =>
            <span>
              {value}
            </span>
          )}
          <span>
            {'}'}
          </span>
        </span>
      );
    }
  }

  return (
    <div style={property ? stylesheet.hasProperty : {}}>
      {property ? `  ${property}${required ? '' : '?'}: ${propType},` : propType}
    </div>
  );
};

export default function PropTable(props) {
  const {type, maxPropObjectKeys, maxPropArrayLength, maxPropStringLength} = props;

  if (!type) {
    return null;
  }

  const accumProps = {};

  if (type.propTypes) {
    Object.keys(type.propTypes).forEach(property => {
      const typeInfo = type.propTypes[property];
      const required = typeInfo.isRequired === undefined ? 'yes' : 'no';
      const docgenInfo =
        type.__docgenInfo && type.__docgenInfo.props && type.__docgenInfo.props[property];
      const description = docgenInfo ? docgenInfo.description : null;
      const propType = formatType({
        propType: docgenInfo && docgenInfo.type && docgenInfo.type.name,
        type: (docgenInfo && docgenInfo.type) || {}
      });

      accumProps[property] = {property, propType, required, description};
    });
  }

  if (type.defaultProps) {
    Object.keys(type.defaultProps).forEach(property => {
      const value = type.defaultProps[property];

      if (value === undefined) {
        return;
      }

      if (!accumProps[property]) {
        accumProps[property] = {property};
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
    maxPropStringLength
  };

  return (
    <table style={stylesheet.propTable}>
      <thead>
        <tr>
          <th style={stylesheet.propTableCell}>property</th>
          <th style={stylesheet.propTableCell}>propType</th>
          <th style={stylesheet.propTableCell}>required</th>
          <th style={stylesheet.propTableCell}>default</th>
          <th style={stylesheet.propTableCell}>description</th>
        </tr>
      </thead>
      <tbody>
        {array.map(row =>
          <tr key={row.property}>
            <td style={stylesheet.propTableCell}>
              {row.property}
            </td>
            <td style={{...stylesheet.propTableCell, ...stylesheet.code}}>
              {row.propType}
            </td>
            <td style={stylesheet.propTableCell}>
              {row.required}
            </td>
            <td style={stylesheet.propTableCell}>
              {row.defaultValue === undefined
                ? '-'
                : <PropVal val={row.defaultValue} {...propValProps} />}
            </td>
            <td style={stylesheet.propTableCell}>
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
  type: null
};
PropTable.propTypes = {
  type: PropTypes.func,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired
};
