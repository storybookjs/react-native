import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { ExtractedProp } from '../../../lib2/extractDocgenProps';
import { renderType } from './renderType';

export function enhancePropTypesProp(extractedProp: ExtractedProp): PropDef {
  const { propDef, docgenInfo } = extractedProp;

  const newtype = renderType(docgenInfo.type, extractedProp);

  if (!isNil(newtype)) {
    propDef.type = newtype;
  }

  return propDef;
}
