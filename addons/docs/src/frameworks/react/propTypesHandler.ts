import { isNil, isEmpty } from 'lodash';
import { PropDef } from '@storybook/components';
import { ReactNode } from 'react';
import { ExtractedProp } from '../../lib2/extractDocgenProps';
import { ExtractedJsDocParam } from '../../lib2/jsdocParser';
import { createPropText } from '../../lib2/createComponents';

interface PropTypesType {
  name: string;
  value?: any;
  computed?: boolean;
  raw?: string;
}

interface EnumValue {
  value: string;
  computed: boolean;
}

interface LongValue {
  caption: string;
  value?: string;
}

// function generateType(type: PropTypesType, extractedProp: ExtractedProp): string {}

function renderCustom(type: PropTypesType): ReactNode {
  // TODO: raw might be a long stringify function, what do we do?
  // If it's a name function it's fine,
  // If it's something that contains "function" or "(" or "{" or "\n" or longuer than X characters we want to show "custom".
  // Could use something to generate an AST from a string. (Also do this for defaultValue);
  return createPropText(isNil(type.raw) ? type.name : type.raw);
}

function generateFuncSignature(
  { jsDocTags }: ExtractedProp,
  hasParams: boolean,
  hasReturns: boolean
): string {
  const funcParts = [];

  if (hasParams) {
    const funcParams = jsDocTags.params.map((x: ExtractedJsDocParam) => {
      const prettyName = x.getPrettyName();
      const typeName = x.getTypeName();

      if (!isNil(typeName)) {
        return `${prettyName}: ${typeName}`;
      }

      return prettyName;
    });

    funcParts.push(`(${funcParams.join(', ')})`);
  } else {
    funcParts.push('()');
  }

  if (hasReturns) {
    funcParts.push(`=> ${jsDocTags.returns.getTypeName()}`);
  }

  return funcParts.join(' ');
}

function renderFunc(extractedProp: ExtractedProp): ReactNode {
  const { jsDocTags } = extractedProp;

  if (!isNil(jsDocTags)) {
    const hasParams = !isNil(jsDocTags.params);
    const hasReturns = !isNil(jsDocTags.returns);

    if (hasParams || hasReturns) {
      return createPropText(generateFuncSignature(extractedProp, hasParams, hasReturns));
    }
  }

  return createPropText('func');
}

function renderShape(type: PropTypesType, extractedProp: ExtractedProp): ReactNode {
  const fields = Object.keys(type.value)
    .map((key: string) => `${key}: ${renderType(type.value[key], extractedProp)}`)
    .join(', ');

  return createPropText(`{ ${fields} }`);
}

function renderUnion(type: PropTypesType, extractedProp: ExtractedProp): ReactNode {
  const newValue = Array.isArray(type.value)
    ? type.value.map(v => renderType(v, extractedProp)).join(' | ')
    : type.value;

  return createPropText(newValue);
}

function generateEnumValue({ value, computed }: EnumValue): LongValue {
  if (computed) {
    // let longValue;

    // try {
    //   // eslint-disable-next-line no-eval
    //   const object = eval(`(${enumValue.value})`);

    //   // TODO: use import objectToString from 'javascript-stringify';
    //   longValue = JSON.stringify(object, null, 2);
    // } catch (e) {
    //   longValue = enumValue.value;
    // }

    let caption = 'object';

    if (value.startsWith('[')) {
      caption = 'array';
    }

    return {
      caption,
      value,
    };
  }

  return {
    caption: value,
  };
}

function renderEnum(type: PropTypesType): ReactNode {
  if (Array.isArray(type.value)) {
    const values = type.value.map(generateEnumValue).reduce(
      (accumulator: any, current: LongValue) => {
        accumulator.text.push(current.caption);
        accumulator.title.push(isNil(current.value) ? current.caption : current.value);

        return accumulator;
      },
      { text: [], title: [] }
    );

    const text = values.text.join(' | ');
    const title = values.title.join(' | ');

    return createPropText(text, { title: text !== title ? title : undefined });
  }

  return createPropText(type.value);
}

function renderArray(type: PropTypesType) {
  let shape = type.value.name;

  if (shape === 'custom') {
    if (type.value.raw) {
      shape = type.value.raw.replace(/PropTypes./g, '').replace(/.isRequired/g, '');
    }
  }

  return createPropText(`${shape}[]`);
}

// TODO: rework to only accept the extractedProp param.
function renderType(type: PropTypesType, extractedProp: ExtractedProp): ReactNode {
  try {
    switch (type.name) {
      case 'custom':
        return renderCustom(type);
      case 'func':
        return renderFunc(extractedProp);
      case 'shape':
        return renderShape(type, extractedProp);
      case 'instanceOf':
        return createPropText(type.value);
      case 'objectOf':
        return createPropText(`objectOf(${renderType(type.value, extractedProp)})`);
      case 'union':
        return renderUnion(type, extractedProp);
      case 'enum':
        return renderEnum(type);
      case 'arrayOf':
        return renderArray(type);
      default:
        return null;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return null;
}

export function enhancePropTypesProp(extractedProp: ExtractedProp): PropDef {
  const { propDef, docgenInfo } = extractedProp;

  const newtype = renderType(docgenInfo.type, extractedProp);
  if (!isNil(newtype)) {
    propDef.type = newtype;
  }

  return propDef;
}
