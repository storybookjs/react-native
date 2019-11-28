import { isNil } from 'lodash';
import { PropType } from '@storybook/components';
import { createSummaryValue, isTooLongForTypeSummary } from '../../../lib';
import { ExtractedProp, DocgenPropType } from '../../../lib/docgen';
import {
  generateFuncSignature,
  generateShortFuncSignature,
  toMultilineSignature,
} from './generateFuncSignature';
import {
  OBJECT_CAPTION,
  ARRAY_CAPTION,
  CLASS_CAPTION,
  FUNCTION_CAPTION,
  ELEMENT_CAPTION,
  CUSTOM_CAPTION,
  isHtmlTag,
  generateObjectCode,
  generateCode,
} from '../lib';
import {
  InspectionType,
  inspectValue,
  InspectionElement,
  InspectionObject,
  InspectionArray,
} from '../lib/inspection';

const MAX_FUNC_LENGTH = 150;

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
  short: string;
  compact: string;
  full: string;
  inferedType?: InspectionType;
}

function createTypeDef({
  name,
  short,
  compact,
  full,
  inferedType,
}: {
  name: string;
  short: string;
  compact: string;
  full?: string;
  inferedType?: InspectionType;
}): TypeDef {
  return {
    name,
    short,
    compact,
    full: !isNil(full) ? full : short,
    inferedType,
  };
}

function cleanPropTypes(value: string): string {
  return value.replace(/PropTypes./g, '').replace(/.isRequired/g, '');
}

function splitIntoLines(value: string): string[] {
  return value.split(/\r?\n/);
}

function prettyObject(ast: any, compact = false): string {
  return cleanPropTypes(generateObjectCode(ast, compact));
}

function prettyArray(ast: any, compact = false): string {
  return cleanPropTypes(generateCode(ast, compact));
}

function getCaptionForInspectionType(type: InspectionType): string {
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

function generateTypeFromString(value: string, originalTypeName: string): TypeDef {
  const { inferedType, ast } = inspectValue(value);
  const { type } = inferedType;

  let short;
  let compact;
  let full;

  switch (type) {
    case InspectionType.IDENTIFIER:
    case InspectionType.LITERAL:
      short = value;
      compact = value;
      break;
    case InspectionType.OBJECT: {
      const { depth } = inferedType as InspectionObject;

      short = OBJECT_CAPTION;
      compact = depth === 1 ? prettyObject(ast, true) : null;
      full = prettyObject(ast);
      break;
    }
    case InspectionType.ELEMENT: {
      const { identifier } = inferedType as InspectionElement;

      short = !isNil(identifier) && !isHtmlTag(identifier) ? identifier : ELEMENT_CAPTION;
      compact = splitIntoLines(value).length === 1 ? value : null;
      full = value;
      break;
    }
    case InspectionType.ARRAY: {
      const { depth } = inferedType as InspectionArray;

      short = ARRAY_CAPTION;
      compact = depth <= 2 ? prettyArray(ast, true) : null;
      full = prettyArray(ast);
      break;
    }
    default:
      short = getCaptionForInspectionType(type);
      compact = splitIntoLines(value).length === 1 ? value : null;
      full = value;
      break;
  }

  return createTypeDef({
    name: originalTypeName,
    short,
    compact,
    full,
    inferedType: type,
  });
}

function generateCustom({ raw }: DocgenPropType): TypeDef {
  if (!isNil(raw)) {
    return generateTypeFromString(raw, PropTypesType.CUSTOM);
  }

  return createTypeDef({
    name: PropTypesType.CUSTOM,
    short: CUSTOM_CAPTION,
    compact: CUSTOM_CAPTION,
  });
}

function generateFunc(extractedProp: ExtractedProp): TypeDef {
  const { jsDocTags } = extractedProp;

  if (!isNil(jsDocTags)) {
    if (!isNil(jsDocTags.params) || !isNil(jsDocTags.returns)) {
      return createTypeDef({
        name: PropTypesType.FUNC,
        short: generateShortFuncSignature(jsDocTags.params, jsDocTags.returns),
        compact: null,
        full: generateFuncSignature(jsDocTags.params, jsDocTags.returns),
      });
    }
  }

  return createTypeDef({
    name: PropTypesType.FUNC,
    short: FUNCTION_CAPTION,
    compact: FUNCTION_CAPTION,
  });
}

function generateShape(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  const fields = Object.keys(type.value)
    .map((key: string) => `${key}: ${generateType(type.value[key], extractedProp).full}`)
    .join(', ');

  const { inferedType, ast } = inspectValue(`{ ${fields} }`);
  const { depth } = inferedType as InspectionObject;

  return createTypeDef({
    name: PropTypesType.SHAPE,
    short: OBJECT_CAPTION,
    compact: depth === 1 ? prettyObject(ast, true) : null,
    full: prettyObject(ast),
  });
}

function objectOf(of: string): string {
  return `objectOf(${of})`;
}

function generateObjectOf(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  const { short, compact, full } = generateType(type.value, extractedProp);

  return createTypeDef({
    name: PropTypesType.OBJECTOF,
    short: objectOf(short),
    compact: !isNil(compact) ? objectOf(compact) : null,
    full: objectOf(full),
  });
}

function generateUnion(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  if (Array.isArray(type.value)) {
    const values = type.value.reduce(
      (acc: any, v: any) => {
        const { short, compact, full } = generateType(v, extractedProp);

        acc.short.push(short);
        acc.compact.push(compact);
        acc.full.push(full);

        return acc;
      },
      { short: [], compact: [], full: [] }
    );

    return createTypeDef({
      name: PropTypesType.UNION,
      short: values.short.join(' | '),
      compact: values.compact.every((x: string) => !isNil(x)) ? values.compact.join(' | ') : null,
      full: values.full.join(' | '),
    });
  }

  return createTypeDef({ name: PropTypesType.UNION, short: type.value, compact: null });
}

function generateEnumValue({ value, computed }: EnumValue): TypeDef {
  return computed
    ? generateTypeFromString(value, 'enumvalue')
    : createTypeDef({ name: 'enumvalue', short: value, compact: value });
}

function generateEnum(type: DocgenPropType): TypeDef {
  if (Array.isArray(type.value)) {
    const values = type.value.reduce(
      (acc: any, v: EnumValue) => {
        const { short, compact, full } = generateEnumValue(v);

        acc.short.push(short);
        acc.compact.push(compact);
        acc.full.push(full);

        return acc;
      },
      { short: [], compact: [], full: [] }
    );

    return createTypeDef({
      name: PropTypesType.ENUM,
      short: values.short.join(' | '),
      compact: values.compact.every((x: string) => !isNil(x)) ? values.compact.join(' | ') : null,
      full: values.full.join(' | '),
    });
  }

  return createTypeDef({ name: PropTypesType.ENUM, short: type.value, compact: type.value });
}

function braceAfter(of: string): string {
  return `${of}[]`;
}

function braceAround(of: string): string {
  return `[${of}]`;
}

function createArrayOfObjectTypeDef(short: string, compact: string, full: string): TypeDef {
  return createTypeDef({
    name: PropTypesType.ARRAYOF,
    short: braceAfter(short),
    compact: !isNil(compact) ? braceAround(compact) : null,
    full: braceAround(full),
  });
}

function generateArray(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  const { name, short, compact, full, inferedType } = generateType(type.value, extractedProp);

  if (name === PropTypesType.CUSTOM) {
    if (inferedType === InspectionType.OBJECT) {
      return createArrayOfObjectTypeDef(short, compact, full);
    }
  } else if (name === PropTypesType.SHAPE) {
    return createArrayOfObjectTypeDef(short, compact, full);
  }

  return createTypeDef({
    name: PropTypesType.ARRAYOF,
    short: braceAfter(short),
    compact: braceAfter(short),
  });
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
        return createTypeDef({
          name: PropTypesType.INSTANCEOF,
          short: type.value,
          compact: type.value,
        });
      case PropTypesType.OBJECTOF:
        return generateObjectOf(type, extractedProp);
      case PropTypesType.UNION:
        return generateUnion(type, extractedProp);
      case PropTypesType.ENUM:
        return generateEnum(type);
      case PropTypesType.ARRAYOF:
        return generateArray(type, extractedProp);
      default:
        return createTypeDef({ name: type.name, short: type.name, compact: type.name });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return createTypeDef({ name: 'unknown', short: 'unknown', compact: 'unknown' });
}

export function createType(extractedProp: ExtractedProp): PropType {
  const { type } = extractedProp.docgenInfo;

  // A type could be null if a defaultProp has been provided without a type definition.
  if (isNil(type)) {
    return null;
  }

  try {
    switch (type.name) {
      case PropTypesType.CUSTOM:
      case PropTypesType.SHAPE:
      case PropTypesType.INSTANCEOF:
      case PropTypesType.OBJECTOF:
      case PropTypesType.UNION:
      case PropTypesType.ENUM:
      case PropTypesType.ARRAYOF: {
        const { short, compact, full } = generateType(type, extractedProp);

        if (!isNil(compact)) {
          if (!isTooLongForTypeSummary(compact)) {
            return createSummaryValue(compact);
          }
        }

        return createSummaryValue(short, short !== full ? full : undefined);
      }
      case PropTypesType.FUNC: {
        const { short, full } = generateType(type, extractedProp);

        let summary = short;
        let detail;

        if (full.length < MAX_FUNC_LENGTH) {
          summary = full;
        } else {
          detail = toMultilineSignature(full);
        }

        return createSummaryValue(summary, detail);
      }
      default:
        return null;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return null;
}
