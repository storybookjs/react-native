import { PropDefaultValue } from '@storybook/components';
import { ARRAY_CAPTION } from '../captions';
import { InspectionResult, InspectionArray } from '../inspection';
import { createSummaryValue, isTooLongForDefaultValueSummary } from '../../../../lib';
import { generateArrayCode } from '../generateCode';

export function generateArray({ inferedType, ast }: InspectionResult): PropDefaultValue {
  const { depth } = inferedType as InspectionArray;

  if (depth <= 2) {
    const compactArray = generateArrayCode(ast, true);

    if (!isTooLongForDefaultValueSummary(compactArray)) {
      return createSummaryValue(compactArray);
    }
  }

  return createSummaryValue(ARRAY_CAPTION, generateArrayCode(ast));
}
