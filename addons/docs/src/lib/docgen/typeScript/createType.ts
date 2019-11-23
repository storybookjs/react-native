import { PropType } from '@storybook/components';
import { DocgenInfo } from '../types';
import { createSummaryValue } from '../../utils';

export function createType({ tsType, required }: DocgenInfo): PropType {
  if (!required) {
    return createSummaryValue(tsType.name.replace(' | undefined', ''));
  }

  return createSummaryValue(tsType.name);
}
