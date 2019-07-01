/* eslint-disable no-underscore-dangle,react/forbid-foreign-prop-types */

import PropTypes from 'prop-types';
import { PropDef } from '@storybook/components';
import { Component } from '../blocks/shared';

interface PropDefMap {
  [p: string]: PropDef;
}

export type PropDefGetter = (type: Component) => PropDef[] | null;

const propTypesMap = new Map();

Object.keys(PropTypes).forEach(typeName => {
  // @ts-ignore
  const type = PropTypes[typeName];

  propTypesMap.set(type, typeName);
  propTypesMap.set(type.isRequired, typeName);
});

const hasDocgen = (obj: any) => obj && obj.props && Object.keys(obj.props).length > 0;

const propsFromDocgen: PropDefGetter = type => {
  const props: PropDefMap = {};
  const docgenInfoProps = type.__docgenInfo.props;

  Object.keys(docgenInfoProps).forEach(property => {
    const docgenInfoProp = docgenInfoProps[property];
    const defaultValueDesc = docgenInfoProp.defaultValue || {};
    const propType = docgenInfoProp.flowType || docgenInfoProp.type || 'other';

    props[property] = {
      name: property,
      type: propType,
      required: docgenInfoProp.required,
      description: docgenInfoProp.description,
      defaultValue: defaultValueDesc.value,
    };
  });

  return Object.values(props);
};

const propsFromPropTypes: PropDefGetter = type => {
  const props: PropDefMap = {};

  if (type.propTypes) {
    Object.keys(type.propTypes).forEach(property => {
      const typeInfo = type.propTypes[property];
      const required = typeInfo.isRequired === undefined;
      const docgenInfo =
        type.__docgenInfo && type.__docgenInfo.props && type.__docgenInfo.props[property];
      const description = docgenInfo ? docgenInfo.description : null;
      let propType = propTypesMap.get(typeInfo) || 'other';

      if (propType === 'other') {
        if (docgenInfo && docgenInfo.type) {
          propType = docgenInfo.type.name;
        }
      }

      props[property] = { name: property, type: propType, required, description };
    });
  }

  if (type.defaultProps) {
    Object.keys(type.defaultProps).forEach(property => {
      const value = type.defaultProps[property];

      if (value === undefined) {
        return;
      }

      if (!props[property]) {
        props[property] = { name: property, type: 'any', required: false };
      }

      props[property].defaultValue = value;
    });
  }

  return Object.values(props);
};

export const getPropDefs: PropDefGetter = type =>
  hasDocgen(type.__docgenInfo) ? propsFromDocgen(type) : propsFromPropTypes(type);
