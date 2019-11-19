import { isNil } from 'lodash';
// @ts-ignore
import { PropDefaultValue, PropSummaryValue } from '@storybook/components';
import { inspectValue } from '../inspection/inspectValue';
import { OBJECT_CAPTION, FUNCTION_CAPTION, ELEMENT_CAPTION, ARRAY_CAPTION } from './captions';
import { generateCode } from './generateCode';
import {
  InspectionFunction,
  InspectionResult,
  InspectionType,
  InspectionElement,
} from '../inspection/types';
import { isHtmlTag } from './isHtmlTag';

const MAX_SUMMARY_LENGTH = 50;

function isTooLongForSummary(value: string): boolean {
  return value.length > MAX_SUMMARY_LENGTH;
}

// TODO: Fix this any type.
function getPrettyIdentifier(inferedType: any): string {
  const { type, identifier } = inferedType;

  switch (type) {
    case InspectionType.FUNCTION:
      return inferedType.hasArguments ? `${identifier}( ... )` : `${identifier}()`;
    case InspectionType.ELEMENT:
      return `<${identifier} />`;
    default:
      return identifier;
  }
}

function createSummaryValue(summary: string, detail?: string): PropSummaryValue {
  return { summary, detail };
}

function generateObject({ ast }: InspectionResult): PropDefaultValue {
  let prettyCaption = generateCode(ast, true);

  // Cannot get escodegen to add a space before the last } with the compact mode settings.
  // This fix it until a better solution is found.
  if (!prettyCaption.endsWith(' }')) {
    prettyCaption = `${prettyCaption.slice(0, -1)} }`;
  }

  return !isTooLongForSummary(prettyCaption)
    ? createSummaryValue(prettyCaption)
    : createSummaryValue(OBJECT_CAPTION, generateCode(ast));
}

function generateFunc({ inferedType, ast }: InspectionResult): PropDefaultValue {
  const { identifier } = inferedType as InspectionFunction;

  if (!isNil(identifier)) {
    return createSummaryValue(getPrettyIdentifier(inferedType), generateCode(ast));
  }

  const prettyCaption = generateCode(ast, true);

  return !isTooLongForSummary(prettyCaption)
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
      const prettyIdentifier = getPrettyIdentifier(inferedType);

      return createSummaryValue(
        prettyIdentifier,
        prettyIdentifier !== defaultValue ? defaultValue : undefined
      );
    }
  }

  return !isTooLongForSummary(defaultValue)
    ? createSummaryValue(defaultValue)
    : createSummaryValue(ELEMENT_CAPTION, defaultValue);
}

function generateArray({ ast }: InspectionResult): PropDefaultValue {
  const prettyCaption = generateCode(ast, true);

  return !isTooLongForSummary(prettyCaption)
    ? createSummaryValue(prettyCaption)
    : createSummaryValue(ARRAY_CAPTION, generateCode(ast));
}

export function createDefaultValue(defaultValue: string): PropDefaultValue {
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
}
