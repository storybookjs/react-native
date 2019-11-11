import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { ExtractedProp } from '../../../lib2/extractDocgenProps';
import { renderType } from './renderType';
import { renderDefaultValue } from './renderDefaultValue';

export function enhancePropTypesProp(extractedProp: ExtractedProp): PropDef {
  const { propDef } = extractedProp;

  const newtype = renderType(extractedProp);
  if (!isNil(newtype)) {
    propDef.type = newtype;
  }

  const { defaultValue } = extractedProp.docgenInfo;
  if (!isNil(defaultValue)) {
    const newDefaultValue = renderDefaultValue(defaultValue.value);
    if (!isNil(newDefaultValue)) {
      propDef.defaultValue = newDefaultValue;
    }
  }

  return propDef;
}
