import { isNil } from 'lodash';
import { ReactNode } from 'react';
import { ExtractedProp } from '../../../lib2/docgen/extractDocgenProps';
import { createPropText } from '../../../lib2/createComponents';
import { DocgenPropType } from '../../../lib2/docgen/types';
import { inspectValue } from '../inspection/inspectValue';
import { generateCode } from './generateCode';
import { generateFuncSignature } from './generateFuncSignature';
import {
  OBJECT_CAPTION,
  ARRAY_CAPTION,
  CLASS_CAPTION,
  FUNCTION_CAPTION,
  ELEMENT_CAPTION,
  CUSTOM_CAPTION,
} from './captions';
import { InspectionType } from '../inspection/types';

const MAX_CAPTION_LENGTH = 35;

enum PropTypesType {
  CUSTOM = 'custom',
  ANY = 'any',
  FUNC = 'func',
  SHAPE = 'shape',
  OBJECT = 'object',
  INSTANCEOF = 'instanceOf',
  OBJECTOF = 'objectOf',
  UNION = 'union',
  ENUM = 'enum',
  ARRAYOF = 'arrayOf',
  ELEMENT = 'element',
  ELEMENTTYPE = 'elementType',
  NODE = 'node',
}

interface EnumValue {
  value: string;
  computed: boolean;
}

interface TypeDef {
  name: string;
  caption: string;
  value: string;
  inferedType?: InspectionType;
}

function createTypeDef({
  name,
  caption,
  value,
  inferedType,
}: {
  name: string;
  caption: string;
  value?: string;
  inferedType?: InspectionType;
}): TypeDef {
  return {
    name,
    caption,
    value: !isNil(value) ? value : caption,
    inferedType,
  };
}

function cleanPropTypes(value: string): string {
  return value.replace(/PropTypes./g, '').replace(/.isRequired/g, '');
}

function prettyObject(ast: any, compact = false): string {
  return cleanPropTypes(generateCode(ast, compact));
}

function getCaptionFromInspectionType(type: InspectionType): string {
  switch (type) {
    case InspectionType.OBJECT:
      return OBJECT_CAPTION;
    case InspectionType.ARRAY:
      return ARRAY_CAPTION;
    case InspectionType.CLASS:
      return CLASS_CAPTION;
    case InspectionType.FUNCTION:
      return FUNCTION_CAPTION;
    case InspectionType.ELEMENT:
      return ELEMENT_CAPTION;
    default:
      return CUSTOM_CAPTION;
  }
}

function isTooLongForCaption(value: string): boolean {
  return value.length > MAX_CAPTION_LENGTH;
}

function generateValuesForObjectAst(ast: any): [string, string] {
  let caption = prettyObject(ast, true);
  let value;

  if (!isTooLongForCaption(caption)) {
    value = caption;
  } else {
    caption = OBJECT_CAPTION;
    value = prettyObject(ast);
  }

  return [caption, value];
}

function generateCustom({ raw }: DocgenPropType): TypeDef {
  if (!isNil(raw)) {
    const { inferedType, ast } = inspectValue(raw);
    const { type, identifier } = inferedType as any;

    let caption;
    let value;

    switch (type) {
      case InspectionType.IDENTIFIER:
      case InspectionType.LITERAL:
        caption = raw;
        break;
      case InspectionType.OBJECT: {
        const [objectCaption, objectValue] = generateValuesForObjectAst(ast);
        caption = objectCaption;
        value = objectValue;
        break;
      }
      case InspectionType.ELEMENT:
        caption = !isNil(identifier) ? identifier : ELEMENT_CAPTION;
        value = raw;
        break;
      default:
        caption = getCaptionFromInspectionType(type);
        value = raw;
        break;
    }

    return createTypeDef({
      name: PropTypesType.CUSTOM,
      caption,
      value,
      inferedType: type,
    });
  }

  return createTypeDef({ name: PropTypesType.CUSTOM, caption: CUSTOM_CAPTION });
}

function generateFunc(extractedProp: ExtractedProp): TypeDef {
  const { jsDocTags } = extractedProp;

  if (!isNil(jsDocTags)) {
    const hasParams = !isNil(jsDocTags.params);
    const hasReturns = !isNil(jsDocTags.returns);

    if (hasParams || hasReturns) {
      return createTypeDef({
        name: PropTypesType.FUNC,
        caption: FUNCTION_CAPTION,
        value: generateFuncSignature(jsDocTags.params, jsDocTags.returns),
      });
    }
  }

  return createTypeDef({ name: PropTypesType.FUNC, caption: FUNCTION_CAPTION });
}

function generateShape(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  const fields = Object.keys(type.value)
    .map((key: string) => `${key}: ${generateType(type.value[key], extractedProp).value}`)
    .join(', ');

  const { ast } = inspectValue(`{ ${fields} }`);
  const [caption, value] = generateValuesForObjectAst(ast);

  return createTypeDef({
    name: PropTypesType.SHAPE,
    caption,
    value,
  });
}

function generateObjectOf(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  const format = (of: string) => `objectOf(${of})`;

  // eslint-disable-next-line prefer-const
  let { name, caption, value } = generateType(type.value, extractedProp);

  if (name === PropTypesType.SHAPE) {
    if (!isTooLongForCaption(value)) {
      caption = value;
    }
  }

  return createTypeDef({
    name: PropTypesType.OBJECTOF,
    caption: format(caption),
    value: format(value),
  });
}

function generateUnion(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  if (Array.isArray(type.value)) {
    const values = type.value.reduce(
      (acc: any, v: any) => {
        const { caption, value } = generateType(v, extractedProp);

        acc.caption.push(caption);
        acc.value.push(value);

        return acc;
      },
      { caption: [], value: [] }
    );

    return createTypeDef({
      name: PropTypesType.UNION,
      caption: values.caption.join(' | '),
      value: values.value.join(' | '),
    });
  }

  return createTypeDef({ name: PropTypesType.UNION, caption: type.value });
}

function generateEnumValue({ value, computed }: EnumValue): TypeDef {
  if (computed) {
    const { inferedType, ast } = inspectValue(value) as any;
    const { type } = inferedType;

    let caption = getCaptionFromInspectionType(type);

    if (
      type === InspectionType.FUNCTION ||
      type === InspectionType.CLASS ||
      type === InspectionType.ELEMENT
    ) {
      if (!isNil(inferedType.identifier)) {
        caption = inferedType.identifier;
      }
    }

    return createTypeDef({
      name: 'enumvalue',
      caption,
      value: type === InspectionType.OBJECT ? prettyObject(ast) : value,
      inferedType: type,
    });
  }

  return createTypeDef({ name: 'enumvalue', caption: value });
}

function generateEnum(type: DocgenPropType): TypeDef {
  if (Array.isArray(type.value)) {
    const values = type.value.reduce(
      (acc: any, v: EnumValue) => {
        const { caption, value } = generateEnumValue(v);

        acc.caption.push(caption);
        acc.value.push(value);

        return acc;
      },
      { caption: [], value: [] }
    );

    return createTypeDef({
      name: PropTypesType.ENUM,
      caption: values.caption.join(' | '),
      value: values.value.join(' | '),
    });
  }

  return createTypeDef({ name: PropTypesType.ENUM, caption: type.value });
}

function braceAfter(of: string): string {
  return `${of}[]`;
}

function braceAround(of: string): string {
  return `[${of}]`;
}

function createArrayOfObjectTypeDef(caption: string, value: string): TypeDef {
  return createTypeDef({
    name: PropTypesType.ARRAYOF,
    caption: caption === OBJECT_CAPTION ? braceAfter(caption) : braceAround(caption),
    value: braceAround(value),
  });
}

function generateArray(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  // eslint-disable-next-line prefer-const
  let { name, caption, value, inferedType } = generateType(type.value, extractedProp);

  if (name === PropTypesType.CUSTOM) {
    if (inferedType === InspectionType.OBJECT) {
      return createArrayOfObjectTypeDef(caption, value);
    }
  } else if (name === PropTypesType.SHAPE) {
    return createArrayOfObjectTypeDef(caption, value);
  }

  return createTypeDef({ name: PropTypesType.ARRAYOF, caption: braceAfter(value) });
}

function generateType(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  try {
    switch (type.name) {
      case PropTypesType.CUSTOM:
        return generateCustom(type);
      case PropTypesType.FUNC:
        return generateFunc(extractedProp);
      case PropTypesType.SHAPE:
        return generateShape(type, extractedProp);
      case PropTypesType.INSTANCEOF:
        return createTypeDef({ name: PropTypesType.INSTANCEOF, caption: type.value });
      case PropTypesType.OBJECTOF:
        return generateObjectOf(type, extractedProp);
      case PropTypesType.UNION:
        return generateUnion(type, extractedProp);
      case PropTypesType.ENUM:
        return generateEnum(type);
      case PropTypesType.ARRAYOF:
        return generateArray(type, extractedProp);
      default:
        return createTypeDef({ name: type.name, caption: type.name });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return createTypeDef({ name: 'unknown', caption: 'unknown' });
}

export function renderType(extractedProp: ExtractedProp): ReactNode {
  const { type } = extractedProp.docgenInfo;

  switch (type.name) {
    case PropTypesType.CUSTOM:
    case PropTypesType.SHAPE:
    case PropTypesType.INSTANCEOF:
    case PropTypesType.OBJECTOF:
    case PropTypesType.UNION:
    case PropTypesType.ENUM:
    case PropTypesType.ARRAYOF: {
      const { caption, value } = generateType(type, extractedProp);

      return createPropText(caption, { title: caption !== value ? value : undefined });
    }
    case PropTypesType.FUNC: {
      const { value } = generateType(type, extractedProp);

      return createPropText(value);
    }
    default:
      return null;
  }
}
