import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { ExtractedProp } from '../../../lib/docgen';
import { createDefaultValue, createDefaultValueFromRawDefaultProp } from '../lib/defaultValues';

export function enhanceTypeScriptProp(extractedProp: ExtractedProp, rawDefaultProp?: any): PropDef {
  const { propDef } = extractedProp;

  const { defaultValue } = extractedProp.docgenInfo;
  if (!isNil(defaultValue) && !isNil(defaultValue.value)) {
    const newDefaultValue = createDefaultValue(defaultValue.value);
    if (!isNil(newDefaultValue)) {
      propDef.defaultValue = newDefaultValue;
    }
  } else if (!isNil(rawDefaultProp)) {
    const newDefaultValue = createDefaultValueFromRawDefaultProp(rawDefaultProp, propDef);

    if (!isNil(newDefaultValue)) {
      propDef.defaultValue = newDefaultValue;
    }
  }

  return propDef;
}

export function enhanceTypeScriptProps(extractedProps: ExtractedProp[]): PropDef[] {
  return extractedProps.map(enhanceTypeScriptProp);
}
