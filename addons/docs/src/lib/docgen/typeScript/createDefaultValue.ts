import { PropDefaultValue } from '@storybook/components';
import { isNil } from 'lodash';
import { DocgenInfo } from '../types';
import { createSummaryValue } from '../../utils';
import { isDefaultValueBlacklisted } from '../utils/defaultValue';

export function createDefaultValue({ defaultValue }: DocgenInfo): PropDefaultValue {
  if (!isNil(defaultValue)) {
    const { value } = defaultValue;

    if (!isDefaultValueBlacklisted(value)) {
      return createSummaryValue(value);
    }
  }

  return null;
}
