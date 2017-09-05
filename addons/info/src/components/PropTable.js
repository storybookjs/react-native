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

const isNotEmpty = obj => obj && obj.props && Object.keys(obj.props).length > 0;

const renderDocgenPropType = propType => {
  if (!propType) {
    return 'unknown';
  }

  const name = propType.name;

  switch (name) {
    case 'arrayOf':
      return `${propType.value.name}[]`;
    case 'instanceOf':
      return propType.value;
    case 'union':
      return propType.raw;
    case 'signature':
      return propType.raw;
    default:
      return name;
  }
};

const hasDocgen = type => isNotEmpty(type.__docgenInfo);

const boolToString = value => (value ? 'yes' : 'no');

const propsFromDocgen = type => {
  const props = {};
  const docgenInfoProps = type.__docgenInfo.props;

  Object.keys(docgenInfoProps).forEach(property => {
    const docgenInfoProp = docgenInfoProps[property];
    const defaultValueDesc = docgenInfoProp.defaultValue || {};
    const propType = docgenInfoProp.flowType || docgenInfoProp.type || 'other';

    props[property] = {
      property,
      propType: renderDocgenPropType(propType),
      required: boolToString(docgenInfoProp.required),
      description: docgenInfoProp.description,
      defaultValue: defaultValueDesc.value,
    };
  });

  return props;
};

const propsFromPropTypes = type => {
  const props = {};

  if (type.propTypes) {
    Object.keys(type.propTypes).forEach(property => {
      const typeInfo = type.propTypes[property];
      const required = boolToString(typeInfo.isRequired === undefined);
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

      props[property] = { property, propType, required, description };
    });
  }

  if (type.defaultProps) {
    Object.keys(type.defaultProps).forEach(property => {
      const value = type.defaultProps[property];

      if (value === undefined) {
        return;
      }

      if (!props[property]) {
        props[property] = { property };
      }

      props[property].defaultValue = value;
    });
  }

  return props;
};

export default function PropTable(props) {
  const { type, maxPropObjectKeys, maxPropArrayLength, maxPropStringLength } = props;

  if (!type) {
    return null;
  }

  const accumProps = hasDocgen(type) ? propsFromDocgen(type) : propsFromPropTypes(type);
  const array = Object.values(accumProps);

  if (!array.length) {
    return <small>No propTypes defined!</small>;
  }

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
        {array.map(row => (
          <tr key={row.property}>
            <td>{row.property}</td>
            <td>{row.propType}</td>
            <td>{row.required}</td>
            <td>
              {row.defaultValue === undefined ? (
                '-'
              ) : (
                <PropVal val={row.defaultValue} {...propValProps} />
              )}
            </td>
            <td>{row.description}</td>
          </tr>
        ))}
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
