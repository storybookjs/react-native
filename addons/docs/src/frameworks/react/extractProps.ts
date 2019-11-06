import PropTypes from 'prop-types';
import { isForwardRef, isMemo } from 'react-is';
import { PropDef } from '@storybook/components';
import { hasDocgen } from '../../lib2/docgenUtils';
import { extractPropsFromDocgen } from '../../lib2/docgenPropsExtractor';
import { PropsExtractor } from '../../lib2/types';
import { Component } from '../../blocks/shared';
import { isPropTypes, enhancePropTypesProp } from './propTypesHandler';

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

  const extractedProps = extractPropsFromDocgen(processedComponent, section);
  if (extractProps.length === 0) {
    return [];
  }

  if (isPropTypes(extractedProps[0].docgenInfo)) {
    extractedProps.map(enhancePropTypesProp);
  }

  return extractedProps.map(x => x.propDef);
}

export const extractProps: PropsExtractor = component => ({
  rows: getPropDefs(component, 'props'),
});
