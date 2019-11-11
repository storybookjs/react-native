import PropTypes from 'prop-types';
import { isForwardRef, isMemo } from 'react-is';
import { PropDef } from '@storybook/components';
import {
  PropDefGetter,
  PropsExtractor,
  extractPropsFromDocgen,
  hasDocgen,
} from '../../lib/docgenUtils';

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

export const getPropDefs: PropDefGetter = (type, section) => {
  let processedType = type;

  // eslint-disable-next-line react/forbid-foreign-prop-types
  if (!hasDocgen(type) && !type.propTypes) {
    if (isForwardRef(type) || type.render) {
      processedType = type.render().type;
    }
    if (isMemo(type)) {
      processedType = type.type().type;
    }
  }

  return extractPropsFromDocgen(processedType, section);
};

export const extractProps: PropsExtractor = component => ({
  rows: getPropDefs(component, 'props'),
});
