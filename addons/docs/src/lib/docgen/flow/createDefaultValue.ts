import { PropDefaultValue } from '@storybook/components';
import { isNil } from 'lodash';
import { DocgenPropDefaultValue, DocgenPropType } from '../types';
import { createSummaryValue, isTooLongForDefaultValueSummary } from '../../utils';

export function createDefaultValue(
  defaultValue: DocgenPropDefaultValue,
  type: DocgenPropType
): PropDefaultValue {
  if (!isNil(defaultValue)) {
    const { value } = defaultValue;

    return !isTooLongForDefaultValueSummary(value)
      ? createSummaryValue(value)
      : createSummaryValue(type.name, value);
  }

  return null;
}
