import PropTypes from 'prop-types';
import { isForwardRef, isMemo } from 'react-is';
import { PropDef } from '@storybook/components';
import { hasDocgen, extractComponentProps, PropsExtractor, TypeSystem } from '../../lib/docgen';
import { Component } from '../../blocks/shared';
import { enhancePropTypesProps } from './propTypes/handleProp';
import { enhanceTypeScriptProps } from './typeScript/handleProp';

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

function getPropDefs(component: Component, section: string): PropDef[] {
  let processedComponent = component;

  // eslint-disable-next-line react/forbid-foreign-prop-types
  if (!hasDocgen(component) && !component.propTypes) {
    if (isForwardRef(component) || component.render) {
      processedComponent = component.render().type;
    }
    if (isMemo(component)) {
      processedComponent = component.type().type;
    }
  }

  const extractedProps = extractComponentProps(processedComponent, section);
  if (extractedProps.length === 0) {
    return [];
  }

  switch (extractedProps[0].typeSystem) {
    case TypeSystem.JAVASCRIPT:
      return enhancePropTypesProps(extractedProps, component);
    case TypeSystem.TYPESCRIPT:
      return enhanceTypeScriptProps(extractedProps);
    default:
      return extractedProps.map(x => x.propDef);
  }
}

export const extractProps: PropsExtractor = component => ({
  rows: getPropDefs(component, 'props'),
});
