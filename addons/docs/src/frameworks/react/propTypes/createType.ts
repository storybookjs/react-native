import { isNil } from 'lodash';
import { PropSummaryValue, PropType } from '@storybook/components';
import { ExtractedProp, DocgenPropType } from '../../../lib/docgen';
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
import { isHtmlTag } from './isHtmlTag';

const MAX_SUMMARY_LENGTH = 35;

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
  value: PropSummaryValue;
  inferedType?: InspectionType;
}

function createTypeDef({
  name,
  summary,
  detail,
  inferedType,
}: {
  name: string;
  summary: string;
  detail?: string;
  inferedType?: InspectionType;
}): TypeDef {
  return {
    name,
    value: {
      summary,
      detail: !isNil(detail) ? detail : summary,
    },
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

function isTooLongForSummary(value: string): boolean {
  return value.length > MAX_SUMMARY_LENGTH;
}

function generateValuesForObjectAst(ast: any): [string, string] {
  let summary = prettyObject(ast, true);
  let detail;

  if (!isTooLongForSummary(summary)) {
    detail = summary;
  } else {
    summary = OBJECT_CAPTION;
    detail = prettyObject(ast);
  }

  return [summary, detail];
}

function generateCustom({ raw }: DocgenPropType): TypeDef {
  if (!isNil(raw)) {
    const { inferedType, ast } = inspectValue(raw);
    const { type, identifier } = inferedType as any;

    let summary;
    let detail;

    switch (type) {
      case InspectionType.IDENTIFIER:
      case InspectionType.LITERAL:
        summary = raw;
        break;
      case InspectionType.OBJECT: {
        const [objectCaption, objectValue] = generateValuesForObjectAst(ast);

        summary = objectCaption;
        detail = objectValue;
        break;
      }
      case InspectionType.ELEMENT:
        summary = !isNil(identifier) && !isHtmlTag(identifier) ? identifier : ELEMENT_CAPTION;
        detail = raw;
        break;
      default:
        summary = getCaptionFromInspectionType(type);
        detail = raw;
        break;
    }

    return createTypeDef({
      name: PropTypesType.CUSTOM,
      summary,
      detail,
      inferedType: type,
    });
  }

  return createTypeDef({ name: PropTypesType.CUSTOM, summary: CUSTOM_CAPTION });
}

function generateFunc(extractedProp: ExtractedProp): TypeDef {
  const { jsDocTags } = extractedProp;

  if (!isNil(jsDocTags)) {
    if (!isNil(jsDocTags.params) || !isNil(jsDocTags.returns)) {
      return createTypeDef({
        name: PropTypesType.FUNC,
        summary: FUNCTION_CAPTION,
        detail: generateFuncSignature(jsDocTags.params, jsDocTags.returns),
      });
    }
  }

  return createTypeDef({ name: PropTypesType.FUNC, summary: FUNCTION_CAPTION });
}

function generateShape(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  const fields = Object.keys(type.value)
    .map((key: string) => `${key}: ${generateType(type.value[key], extractedProp).value.detail}`)
    .join(', ');

  const { ast } = inspectValue(`{ ${fields} }`);
  const [summary, detail] = generateValuesForObjectAst(ast);

  return createTypeDef({
    name: PropTypesType.SHAPE,
    summary,
    detail,
  });
}

function generateObjectOf(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  const format = (of: string) => `objectOf(${of})`;

  const { name, value } = generateType(type.value, extractedProp);
  // eslint-disable-next-line prefer-const
  let { summary, detail } = value;

  if (name === PropTypesType.SHAPE) {
    if (!isTooLongForSummary(detail)) {
      summary = detail;
    }
  }

  return createTypeDef({
    name: PropTypesType.OBJECTOF,
    summary: format(summary),
    detail: format(detail),
  });
}

function generateUnion(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  if (Array.isArray(type.value)) {
    const values = type.value.reduce(
      (acc: any, v: any) => {
        const { summary, detail } = generateType(v, extractedProp).value;

        acc.summary.push(summary);
        acc.detail.push(detail);

        return acc;
      },
      { summary: [], detail: [] }
    );

    return createTypeDef({
      name: PropTypesType.UNION,
      summary: values.summary.join(' | '),
      detail: values.detail.join(' | '),
    });
  }

  return createTypeDef({ name: PropTypesType.UNION, summary: type.value });
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
      summary: caption,
      detail: type === InspectionType.OBJECT ? prettyObject(ast) : value,
      inferedType: type,
    });
  }

  return createTypeDef({ name: 'enumvalue', summary: value });
}

function generateEnum(type: DocgenPropType): TypeDef {
  if (Array.isArray(type.value)) {
    const values = type.value.reduce(
      (acc: any, v: EnumValue) => {
        const { summary, detail } = generateEnumValue(v).value;

        acc.summary.push(summary);
        acc.detail.push(detail);

        return acc;
      },
      { summary: [], detail: [] }
    );

    return createTypeDef({
      name: PropTypesType.ENUM,
      summary: values.summary.join(' | '),
      detail: values.detail.join(' | '),
    });
  }

  return createTypeDef({ name: PropTypesType.ENUM, summary: type.value });
}

function braceAfter(of: string): string {
  return `${of}[]`;
}

function braceAround(of: string): string {
  return `[${of}]`;
}

function createArrayOfObjectTypeDef(summary: string, detail: string): TypeDef {
  return createTypeDef({
    name: PropTypesType.ARRAYOF,
    summary: summary === OBJECT_CAPTION ? braceAfter(summary) : braceAround(summary),
    detail: braceAround(detail),
  });
}

function generateArray(type: DocgenPropType, extractedProp: ExtractedProp): TypeDef {
  const { name, value, inferedType } = generateType(type.value, extractedProp);
  const { summary, detail } = value;

  if (name === PropTypesType.CUSTOM) {
    if (inferedType === InspectionType.OBJECT) {
      return createArrayOfObjectTypeDef(summary, detail);
    }
  } else if (name === PropTypesType.SHAPE) {
    return createArrayOfObjectTypeDef(summary, detail);
  }

  return createTypeDef({ name: PropTypesType.ARRAYOF, summary: braceAfter(detail) });
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
        return createTypeDef({ name: PropTypesType.INSTANCEOF, summary: type.value });
      case PropTypesType.OBJECTOF:
        return generateObjectOf(type, extractedProp);
      case PropTypesType.UNION:
        return generateUnion(type, extractedProp);
      case PropTypesType.ENUM:
        return generateEnum(type);
      case PropTypesType.ARRAYOF:
        return generateArray(type, extractedProp);
      default:
        return createTypeDef({ name: type.name, summary: type.name });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return createTypeDef({ name: 'unknown', summary: 'unknown' });
}

export function createType(extractedProp: ExtractedProp): PropType {
  const { type } = extractedProp.docgenInfo;

  switch (type.name) {
    case PropTypesType.CUSTOM:
    case PropTypesType.SHAPE:
    case PropTypesType.INSTANCEOF:
    case PropTypesType.OBJECTOF:
    case PropTypesType.UNION:
    case PropTypesType.ENUM:
    case PropTypesType.ARRAYOF: {
      const { summary, detail } = generateType(type, extractedProp).value;

      return {
        summary,
        detail: summary !== detail ? detail : undefined,
      };
    }
    case PropTypesType.FUNC: {
      const { detail } = generateType(type, extractedProp).value;

      return { summary: detail };
    }
    default:
      return null;
  }
}
