import { isNil } from 'lodash';
import { PropDefaultValue } from '@storybook/components';
import { FUNCTION_CAPTION, ELEMENT_CAPTION } from '../captions';
import {
  InspectionFunction,
  InspectionResult,
  InspectionType,
  InspectionElement,
  InspectionIdentifiableInferedType,
  inspectValue,
} from '../inspection';
import { isHtmlTag } from '../isHtmlTag';
import { createSummaryValue, isTooLongForDefaultValueSummary } from '../../../../lib';
import { generateCode } from '../generateCode';
import { generateObject } from './generateObject';
import { generateArray } from './generateArray';
import { getPrettyIdentifier } from './prettyIdentifier';

function generateFunc({ inferedType, ast }: InspectionResult): PropDefaultValue {
  const { identifier } = inferedType as InspectionFunction;

  if (!isNil(identifier)) {
    return createSummaryValue(
      getPrettyIdentifier(inferedType as InspectionIdentifiableInferedType),
      generateCode(ast)
    );
  }

  const prettyCaption = generateCode(ast, true);

  return !isTooLongForDefaultValueSummary(prettyCaption)
    ? createSummaryValue(prettyCaption)
    : createSummaryValue(FUNCTION_CAPTION, generateCode(ast));
}

// All elements are JSX elements.
// JSX elements are not supported by escodegen.
function generateElement(
  defaultValue: string,
  inspectionResult: InspectionResult
): PropDefaultValue {
  const { inferedType } = inspectionResult;
  const { identifier } = inferedType as InspectionElement;

  if (!isNil(identifier)) {
    if (!isHtmlTag(identifier)) {
      const prettyIdentifier = getPrettyIdentifier(
        inferedType as InspectionIdentifiableInferedType
      );

      return createSummaryValue(
        prettyIdentifier,
        prettyIdentifier !== defaultValue ? defaultValue : undefined
      );
    }
  }

  return !isTooLongForDefaultValueSummary(defaultValue)
    ? createSummaryValue(defaultValue)
    : createSummaryValue(ELEMENT_CAPTION, defaultValue);
}

export function createDefaultValue(defaultValue: string): PropDefaultValue {
  try {
    const inspectionResult = inspectValue(defaultValue);

    switch (inspectionResult.inferedType.type) {
      case InspectionType.OBJECT:
        return generateObject(inspectionResult);
      case InspectionType.FUNCTION:
        return generateFunc(inspectionResult);
      case InspectionType.ELEMENT:
        return generateElement(defaultValue, inspectionResult);
      case InspectionType.ARRAY:
        return generateArray(inspectionResult);
      default:
        return null;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return null;
}
