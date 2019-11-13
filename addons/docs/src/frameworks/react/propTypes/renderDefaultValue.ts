import { isNil } from 'lodash';
// @ts-ignore
import htmlTags from 'html-tags';
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

const MAX_DEFAULT_VALUE_LENGTH = 50;

function isTooLongForDefaultValue(value: string): boolean {
  return value.length > MAX_DEFAULT_VALUE_LENGTH;
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

function createSummaryValue(summary: string, detail: string): PropSummaryValue {
  return { summary, detail };
}

function renderObject({ ast }: InspectionResult): PropDefaultValue {
  let prettyCaption = generateCode(ast, true);

  // Cannot get escodegen to add a space before the last } with the compact mode settings.
  // This fix it until a better solution is found.
  if (!prettyCaption.endsWith(' }')) {
    prettyCaption = `${prettyCaption.slice(0, -1)} }`;
  }

  return !isTooLongForDefaultValue(prettyCaption)
    ? prettyCaption
    : createSummaryValue(OBJECT_CAPTION, generateCode(ast));
}

function renderFunc({ inferedType, ast }: InspectionResult): PropDefaultValue {
  const { identifier } = inferedType as InspectionFunction;

  if (!isNil(identifier)) {
    return createSummaryValue(getPrettyIdentifier(inferedType), generateCode(ast));
    // return createPropText(getPrettyIdentifier(inferedType), { title: generateCode(ast) });
  }

  const prettyCaption = generateCode(ast, true);

  return !isTooLongForDefaultValue(prettyCaption)
    ? prettyCaption
    : createSummaryValue(FUNCTION_CAPTION, generateCode(ast));

  // return !isTooLongForDefaultValue(prettyCaption)
  //   ? createPropText(prettyCaption)
  //   : createPropText(FUNCTION_CAPTION, { title: generateCode(ast) });
}

// All elements are JSX elements.
// JSX elements cannot are not supported by escodegen.
function renderElement(defaultValue: string, inspectionResult: InspectionResult): PropDefaultValue {
  const { inferedType } = inspectionResult;
  const { identifier } = inferedType as InspectionElement;

  if (!isNil(identifier)) {
    const isHtmlTag = htmlTags.includes(identifier.toLowerCase());

    if (!isHtmlTag) {
      const prettyIdentifier = getPrettyIdentifier(inferedType);

      return createSummaryValue(
        prettyIdentifier,
        prettyIdentifier !== defaultValue ? defaultValue : undefined
      );

      // return createPropText(prettyIdentifier, {
      //   title: prettyIdentifier !== defaultValue ? defaultValue : undefined,
      // });
    }
  }

  return !isTooLongForDefaultValue(defaultValue)
    ? defaultValue
    : createSummaryValue(ELEMENT_CAPTION, defaultValue);

  // return !isTooLongForDefaultValue(defaultValue)
  //   ? createPropText(defaultValue)
  //   : createPropText(ELEMENT_CAPTION, { title: defaultValue });
}

function renderArray({ ast }: InspectionResult): PropDefaultValue {
  const prettyCaption = generateCode(ast, true);

  return !isTooLongForDefaultValue(prettyCaption)
    ? prettyCaption
    : createSummaryValue(ARRAY_CAPTION, generateCode(ast));

  // return !isTooLongForDefaultValue(prettyCaption)
  //   ? createPropText(prettyCaption)
  //   : createPropText(ARRAY_CAPTION, { title: generateCode(ast) });
}

export function renderDefaultValue(defaultValue: string): PropDefaultValue {
  const inspectionResult = inspectValue(defaultValue);

  switch (inspectionResult.inferedType.type) {
    case InspectionType.OBJECT:
      return renderObject(inspectionResult);
    case InspectionType.FUNCTION:
      return renderFunc(inspectionResult);
    case InspectionType.ELEMENT:
      return renderElement(defaultValue, inspectionResult);
    case InspectionType.ARRAY:
      return renderArray(inspectionResult);
    default:
      return null;
  }
}
