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
    marginLeft: 10,
  },
  code: {
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
  },
  block: {
    display: 'block',
  },
  propTable: {
    marginTop: 10,
    borderCollapse: 'collapse',
  },
  propTableCell: {
    border: '1px solid #ccc',
    padding: '2px 6px',
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

const formatType = ({ propType, type, property, required }) => {
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
        <span style={property ? { ...stylesheet.block, ...stylesheet.hasProperty } : {}}>
          {PropertyLabel}
          <span>[</span>
          <span>
            {formatType({
              parentType: propType,
              type: type.value,
              propType: type.value.name,
            })}
          </span>
          <span>]</span>
        </span>
      );
    } else if (propType === 'enum') {
      return (
        <div>
          {type.value.map(({ value }) => value).join(' | ')}
        </div>
      );
    } else if (propType === 'shape') {
      const values = Object.keys(type.value).map(property =>
        formatType({
          property,
          parentType: propType,
          type: type.value[property],
          propType: type.value[property].name,
          required: type.value[property].required,
        })
      );

      return (
        <span style={property ? { ...stylesheet.block, ...stylesheet.hasProperty } : {}}>
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
      const required = typeInfo.isRequired === undefined ? 'yes' : 'no';
      const docgenInfo =
        type.__docgenInfo && type.__docgenInfo.props && type.__docgenInfo.props[property];
      const description = docgenInfo ? docgenInfo.description : null;
      let propType = PropTypesMap.get(typeInfo) || 'other';

      if (propType === 'other') {
        if (docgenInfo && docgenInfo.type) {
          propType = type.__docgenInfo.props[property].type.name;
        }
      }
      // const propType = formatType({
      // propType: docgenInfo && docgenInfo.type && docgenInfo.type.name,
      // type: (docgenInfo && docgenInfo.type) || {}
      // });

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
            <td style={{ ...stylesheet.propTableCell, ...stylesheet.code }}>
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
  type: null,
};
PropTable.propTypes = {
  type: PropTypes.func,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
};
