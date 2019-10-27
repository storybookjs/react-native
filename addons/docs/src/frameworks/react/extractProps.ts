/* eslint-disable no-underscore-dangle,react/forbid-foreign-prop-types */
import PropTypes from 'prop-types';
import { isForwardRef, isMemo } from 'react-is';
import { PropDef } from '@storybook/components';
import { PropDefGetter, PropsExtractor, propsFromDocgen, hasDocgen } from '../../lib/docgenUtils';

export interface PropDefMap {
  [p: string]: PropDef;
}

const propTypesMap = new Map();

Object.keys(PropTypes).forEach(typeName => {
  // @ts-ignore
  const type = PropTypes[typeName];

  propTypesMap.set(type, typeName);
  propTypesMap.set(type.isRequired, typeName);
});

const propsFromPropTypes: PropDefGetter = (type, section) => {
  const props: PropDefMap = {};

  if (type.propTypes) {
    Object.keys(type.propTypes).forEach(property => {
      const typeInfo = type.propTypes[property];
      const required = typeInfo.isRequired === undefined;
      const docgenInfo =
        type.__docgenInfo && type.__docgenInfo[section] && type.__docgenInfo[section][property];
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

export const getPropDefs: PropDefGetter = (type, section) => {
  let processedType = type;
  if (!hasDocgen(type)) {
    if (isForwardRef(type) || type.render) {
      processedType = type.render().type;
    }
    if (isMemo(type)) {
      // (typeof type.type === 'function')?
      processedType = type.type().type;
    }
  }
  return hasDocgen(processedType)
    ? propsFromDocgen(processedType, section)
    : propsFromPropTypes(processedType, section);
};

export const extractProps: PropsExtractor = component => ({
  rows: getPropDefs(component, 'props'),
});
