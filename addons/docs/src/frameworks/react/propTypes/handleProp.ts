import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { ExtractedProp } from '../../../lib/docgen';
import { createType } from './createType';
import { createDefaultValue } from './createDefaultValue';
import { Component } from '../../../blocks/shared';
import { keepOriginalDefinitionOrder } from './sortProps';

export function enhancePropTypesProp(extractedProp: ExtractedProp): PropDef {
  const { propDef } = extractedProp;

  const newtype = createType(extractedProp);
  if (!isNil(newtype)) {
    propDef.type = newtype;
  }

  const { defaultValue } = extractedProp.docgenInfo;
  if (!isNil(defaultValue)) {
    const newDefaultValue = createDefaultValue(defaultValue.value);
    if (!isNil(newDefaultValue)) {
      propDef.defaultValue = newDefaultValue;
    }
  }

  return propDef;
}

export function enhancePropTypesProps(
  extractedProps: ExtractedProp[],
  component: Component
): PropDef[] {
  const enhancedProps = extractedProps.map(enhancePropTypesProp);

  return keepOriginalDefinitionOrder(enhancedProps, component);
}
