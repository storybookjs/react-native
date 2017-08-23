/* eslint-disable no-underscore-dangle */

import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles';
import PropVal from './PropVal';
import PrettyPropType from './types/PrettyPropType';

const PropTypesMap = new Map();

Object.keys(PropTypes).forEach(typeName => {
  const type = PropTypes[typeName];

  PropTypesMap.set(type, typeName);
  PropTypesMap.set(type.isRequired, typeName);
});

const isNotEmpty = obj => obj && obj.props && Object.keys(obj.props).length > 0;

const hasDocgen = type => isNotEmpty(type.__docgenInfo);

const propsFromDocgen = type => {
  const props = {};
  const docgenInfoProps = type.__docgenInfo.props;

  Object.keys(docgenInfoProps).forEach(property => {
    const docgenInfoProp = docgenInfoProps[property];
    const defaultValueDesc = docgenInfoProp.defaultValue || {};
    const propType = docgenInfoProp.flowType || docgenInfoProp.type || 'other';

    props[property] = {
      property,
      propType,
      required: docgenInfoProp.required,
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
      const required = typeInfo.isRequired === undefined;
      const docgenInfo =
        type.__docgenInfo && type.__docgenInfo.props && type.__docgenInfo.props[property];
      const description = docgenInfo ? docgenInfo.description : null;
      let propType = PropTypesMap.get(typeInfo) || 'other';

      if (propType === 'other') {
        if (docgenInfo && docgenInfo.type) {
          propType = docgenInfo.type.name;
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
    <table style={styles.propTable}>
      <thead>
        <tr>
          <th style={styles.propTableCell}>property</th>
          <th style={styles.propTableCell}>propType</th>
          <th style={styles.propTableCell}>required</th>
          <th style={styles.propTableCell}>default</th>
          <th style={styles.propTableCell}>description</th>
        </tr>
      </thead>
      <tbody>
        {array.map(row =>
          <tr key={row.property}>
            <td style={{ ...styles.propTableCell, ...styles.code }}>
              {row.property}
            </td>
            <td style={{ ...styles.propTableCell, ...styles.code }}>
              <PrettyPropType propType={row.propType} />
            </td>
            <td style={styles.propTableCell}>
              {row.required ? 'yes' : '-'}
            </td>
            <td style={styles.propTableCell}>
              {row.defaultValue === undefined
                ? '-'
                : <PropVal val={row.defaultValue} {...propValProps} />}
            </td>
            <td style={styles.propTableCell}>
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
