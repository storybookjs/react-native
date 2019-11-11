import { ReactNode } from 'react';
import { isNil } from 'lodash';
import { ExtractedProp } from '../../../lib2/extractDocgenProps';
import { PropTypesType } from './types';
import { createPropText } from '../../../lib2/createComponents';
import { InspectionType, inspectValue } from './inspection/inspectValue';
import { CUSTOM_CAPTION, OBJECT_CAPTION, FUNCTION_CAPTION } from './captions';
import { generateCode } from './generateCode';
import { InspectionFunction } from './inspection/types';

const MAX_DEFAULT_VALUE_LENGTH = 50;

function isTooLongForDefaultValue(value: string): boolean {
  return value.length > MAX_DEFAULT_VALUE_LENGTH;
}

function renderCustom(defaultValue: string): ReactNode {
  const { inferedType, ast } = inspectValue(defaultValue);

  switch (inferedType.type) {
    case InspectionType.OBJECT:
      return renderObject(defaultValue);
    default:
      return createPropText(CUSTOM_CAPTION, { title: defaultValue });
  }
}

function renderAny(defaultValue: string): ReactNode {
  const { inferedType } = inspectValue(defaultValue);

  return createPropText(defaultValue);
}

function renderObject(defaultValue: string): ReactNode {
  const { ast } = inspectValue(defaultValue);

  const prettyCaption = generateCode(ast, true);

  return !isTooLongForDefaultValue(prettyCaption)
    ? createPropText(prettyCaption)
    : createPropText(OBJECT_CAPTION, { title: generateCode(ast) });
}

function renderFunc(defaultValue: string): ReactNode {
  const { inferedType, ast } = inspectValue(defaultValue);
  const { identifier } = inferedType as InspectionFunction;

  if (!isNil(identifier)) {
    return createPropText(identifier, { title: generateCode(ast) });
  }

  const prettyCaption = generateCode(ast, true);

  return !isTooLongForDefaultValue(prettyCaption)
    ? createPropText(prettyCaption)
    : createPropText(FUNCTION_CAPTION, { title: generateCode(ast) });
}

function renderElementOrNode(defaultValue: string, defaultCaption: string): ReactNode {
  const { inferedType } = inspectValue(defaultValue);

  // if ()

  return createPropText(defaultValue);
}

export function renderDefaultValue({ docgenInfo }: ExtractedProp): ReactNode {
  const { type, defaultValue } = docgenInfo;

  if (!isNil(defaultValue)) {
    const { value } = defaultValue;

    switch (type.name) {
      case PropTypesType.CUSTOM:
        return renderCustom(value);
      case PropTypesType.ANY:
        return renderAny(value);
      case PropTypesType.SHAPE:
      case PropTypesType.OBJECT:
        return renderObject(value);
      case PropTypesType.FUNC:
        return renderFunc(value);
      case PropTypesType.ELEMENT:
        return renderElementOrNode(value, 'element');
      case PropTypesType.NODE:
        return renderElementOrNode(value, 'node');
      default:
        return null;
    }
  }

  return null;
}
