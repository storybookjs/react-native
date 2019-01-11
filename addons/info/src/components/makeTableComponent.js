/* eslint-disable no-underscore-dangle,react/forbid-foreign-prop-types */
import PropTypes from 'prop-types';
import React from 'react';

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

export default function makeTableComponent(Component) {
  const TableComponent = props => {
    const { type } = props;
    if (!type) {
      return null;
    }

    const propDefinitionsMap = hasDocgen(type) ? propsFromDocgen(type) : propsFromPropTypes(type);
    const propDefinitions = Object.values(propDefinitionsMap);

    return <Component propDefinitions={propDefinitions} {...props} />;
  };

  TableComponent.propTypes = {
    type: PropTypes.func.isRequired,
  };

  return TableComponent;
}
