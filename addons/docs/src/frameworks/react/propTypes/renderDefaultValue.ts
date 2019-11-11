import { ReactNode } from 'react';
import { isNil } from 'lodash';
import htmlTags from 'html-tags';
import { ExtractedProp } from '../../../lib2/extractDocgenProps';
import { createPropText } from '../../../lib2/createComponents';
import { inspectValue } from './inspection/inspectValue';
import { OBJECT_CAPTION, FUNCTION_CAPTION, ELEMENT_CAPTION, ARRAY_CAPTION } from './captions';
import { generateCode } from './generateCode';
import {
  InspectionFunction,
  InspectionResult,
  InspectionType,
  InspectionElement,
} from './inspection/types';

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
      return inferedType.isJsx ? `<${identifier} />` : identifier;
    default:
      return identifier;
  }
}

function renderObject({ ast }: InspectionResult): ReactNode {
  let prettyCaption = generateCode(ast, true);

  // Cannot get escodegen to add a space before the last } with the compact mode settings.
  // This fix it until a better solution is found.
  if (!prettyCaption.endsWith(' }')) {
    prettyCaption = `${prettyCaption.slice(0, -1)} }`;
  }

  return !isTooLongForDefaultValue(prettyCaption)
    ? createPropText(prettyCaption)
    : createPropText(OBJECT_CAPTION, { title: generateCode(ast) });
}

function renderFunc({ inferedType, ast }: InspectionResult): ReactNode {
  const { identifier } = inferedType as InspectionFunction;

  if (!isNil(identifier)) {
    return createPropText(getPrettyIdentifier(inferedType), { title: generateCode(ast) });
  }

  const prettyCaption = generateCode(ast, true);

  return !isTooLongForDefaultValue(prettyCaption)
    ? createPropText(prettyCaption)
    : createPropText(FUNCTION_CAPTION, { title: generateCode(ast) });
}

// All elements are JSX elements.
// JSX elements cannot are not supported by escodegen.
function renderElement(defaultValue: string, inspectionResult: InspectionResult): ReactNode {
  const { inferedType } = inspectionResult;
  const { identifier } = inferedType as InspectionElement;

  if (!isNil(identifier)) {
    const isHtmlTag = htmlTags.includes(identifier.toLowerCase());

    if (!isHtmlTag) {
      const prettyIdentifier = getPrettyIdentifier(inferedType);

      return createPropText(prettyIdentifier, {
        title: prettyIdentifier !== defaultValue ? defaultValue : undefined,
      });
    }
  }

  return !isTooLongForDefaultValue(defaultValue)
    ? createPropText(defaultValue)
    : createPropText(ELEMENT_CAPTION, { title: defaultValue });
}

function renderArray({ ast }: InspectionResult): ReactNode {
  const prettyCaption = generateCode(ast, true);

  return !isTooLongForDefaultValue(prettyCaption)
    ? createPropText(prettyCaption)
    : createPropText(ARRAY_CAPTION, { title: generateCode(ast) });
}

export function renderDefaultValue(defaultValue: string): ReactNode {
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
