import { PropDefaultValue } from '@storybook/components';
import { OBJECT_CAPTION } from '../captions';
import { InspectionResult, InspectionArray } from '../inspection';
import { createSummaryValue, isTooLongForDefaultValueSummary } from '../../../../lib';
import { generateObjectCode } from '../generateCode';

export function generateObject({ inferedType, ast }: InspectionResult): PropDefaultValue {
  const { depth } = inferedType as InspectionArray;

  if (depth === 1) {
    const compactObject = generateObjectCode(ast, true);

    if (!isTooLongForDefaultValueSummary(compactObject)) {
      return createSummaryValue(compactObject);
    }
  }

  return createSummaryValue(OBJECT_CAPTION, generateObjectCode(ast));
}
