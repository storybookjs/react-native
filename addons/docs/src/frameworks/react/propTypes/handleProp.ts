import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { ExtractedProp } from '../../../lib/docgen';
import { createType } from './createType';
import { createDefaultValue } from './createDefaultValue';

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
