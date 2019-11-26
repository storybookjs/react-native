import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { ExtractedProp } from '../../../lib/docgen';
import { createDefaultValue } from '../lib/createDefaultValue';

export function enhanceTypeScriptProp(extractedProp: ExtractedProp): PropDef {
  const { propDef } = extractedProp;

  const { defaultValue } = extractedProp.docgenInfo;
  if (!isNil(defaultValue)) {
    const newDefaultValue = createDefaultValue(defaultValue.value);
    if (!isNil(newDefaultValue)) {
      propDef.defaultValue = newDefaultValue;
    }
  }

  return propDef;
}

export function enhanceTypeScriptProps(extractedProps: ExtractedProp[]): PropDef[] {
  return extractedProps.map(enhanceTypeScriptProp);
}
