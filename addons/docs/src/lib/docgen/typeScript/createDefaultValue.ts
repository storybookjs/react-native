import { PropDefaultValue } from '@storybook/components';
import { isNil } from 'lodash';
import { DocgenInfo } from '../types';
import { createSummaryValue, isTooLongForDefaultValueSummary } from '../../utils';
import { isDefaultValueBlacklisted } from '../utils/defaultValue';

export function createDefaultValue({ type, defaultValue }: DocgenInfo): PropDefaultValue {
  if (!isNil(defaultValue)) {
    const { value } = defaultValue;

    if (!isDefaultValueBlacklisted(value)) {
      return !isTooLongForDefaultValueSummary(value)
        ? createSummaryValue(value)
        : createSummaryValue(type.name, value);
    }
  }

  return null;
}
