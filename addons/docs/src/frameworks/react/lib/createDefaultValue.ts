import { isNil } from 'lodash';
// @ts-ignore
import { PropDefaultValue } from '@storybook/components';
import {
  OBJECT_CAPTION,
  FUNCTION_CAPTION,
  ELEMENT_CAPTION,
  ARRAY_CAPTION,
} from '../propTypes/captions';
import {
  InspectionFunction,
  InspectionResult,
  InspectionType,
  InspectionElement,
  InspectionIdentifiableInferedType,
  inspectValue,
  InspectionArray,
} from './inspection';
import { isHtmlTag } from './isHtmlTag';
import { createSummaryValue, isTooLongForDefaultValueSummary } from '../../../lib';
import { generateObjectCode, generateCode, generateArrayCode } from './generateCode';

function getPrettyIdentifier(inferedType: InspectionIdentifiableInferedType): string {
  const { type, identifier } = inferedType;

  switch (type) {
    case InspectionType.FUNCTION:
      return (inferedType as InspectionFunction).hasArguments
        ? `${identifier}( ... )`
        : `${identifier}()`;
    case InspectionType.ELEMENT:
      return `<${identifier} />`;
    default:
      return identifier;
  }
}

function generateObject({ inferedType, ast }: InspectionResult): PropDefaultValue {
  const { depth } = inferedType as InspectionArray;

  if (depth === 1) {
    const compactObject = generateObjectCode(ast, true);

    if (!isTooLongForDefaultValueSummary(compactObject)) {
      return createSummaryValue(compactObject);
    }
  }

  return createSummaryValue(OBJECT_CAPTION, generateObjectCode(ast));
}

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

function generateArray({ inferedType, ast }: InspectionResult): PropDefaultValue {
  const { depth } = inferedType as InspectionArray;

  if (depth <= 2) {
    const compactArray = generateArrayCode(ast, true);

    if (!isTooLongForDefaultValueSummary(compactArray)) {
      return createSummaryValue(compactArray);
    }
  }

  return createSummaryValue(ARRAY_CAPTION, generateArrayCode(ast));
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
