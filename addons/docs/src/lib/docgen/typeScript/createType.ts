import { PropType } from '@storybook/components';
import { isNil } from 'lodash';
import { DocgenInfo } from '../types';
import { createSummaryValue } from '../../utils';

export function createType({ tsType, required }: DocgenInfo): PropType {
  // A type could be null if a defaultProp has been provided without a type definition.
  if (isNil(tsType)) {
    return null;
  }

  if (!required) {
    return createSummaryValue(tsType.name.replace(' | undefined', ''));
  }

  return createSummaryValue(tsType.name);
}
