import { isNil } from 'lodash';
import { PropDefaultValue } from '@storybook/components';
import { DocgenPropDefaultValue } from './types';
import { createSummaryValue } from '../utils';

const BLACKLIST = ['null', 'undefined'];

function isDefaultValueBlacklisted(value: string) {
  return BLACKLIST.some(x => x === value);
}

export function createDefaultValue(defaultValue: DocgenPropDefaultValue): PropDefaultValue {
  if (!isNil(defaultValue)) {
    const { value } = defaultValue;

    if (!isDefaultValueBlacklisted(value)) {
      return createSummaryValue(value);
    }
  }

  return null;
}
