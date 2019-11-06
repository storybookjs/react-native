import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { DocgenInfo } from '../../lib2/types';
import { ExtractedProp } from '../../lib2/docgenPropsExtractor';
import { ExtractedJsDocParamTag } from '../../lib2/jsdocParser';

interface PropTypesType {
  name: string;
  value?: any;
  computed?: boolean;
  raw?: string;
}

export function isPropTypes(docgenInfo: DocgenInfo): boolean {
  return !isNil(docgenInfo.type);
}

function generateSignature(
  { jsDocTags }: ExtractedProp,
  hasParams: boolean,
  hasReturns: boolean
): string {
  const funcParts = [];

  if (hasParams) {
    const funcParams = jsDocTags.params.map((x: ExtractedJsDocParamTag) => {
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

function extractType(type: PropTypesType, extractedProp: ExtractedProp): string {
  try {
    switch (type.name) {
      case 'func': {
        const { jsDocTags } = extractedProp;

        if (!isNil(jsDocTags)) {
          const hasParams = !isNil(jsDocTags.params);
          const hasReturns = !isNil(jsDocTags.returns);

          if (hasParams || hasReturns) {
            return generateSignature(extractedProp, hasParams, hasReturns);
          }
        }

        return 'func';
      }
      case 'shape': {
        const fields = Object.keys(type.value)
          .map((key: string) => `${key}: ${extractType(type.value[key], extractedProp)}`)
          .join(', ');
        return `{ ${fields} }`;
      }
      case 'union':
        return Array.isArray(type.value)
          ? `Union<${type.value.map(v => extractType(v, extractedProp)).join(' | ')}>`
          : JSON.stringify(type.value);
      case 'arrayOf': {
        let shape = type.value.name;

        if (shape === 'custom') {
          if (type.value.raw) {
            shape = type.value.raw.replace(/PropTypes./g, '').replace(/.isRequired/g, '');
          }
        }

        return `[ ${shape} ]`;
      }
      case 'objectOf':
        return `objectOf(${extractType(type.value, extractedProp)})`;
      case 'enum':
        if (type.computed) {
          return JSON.stringify(type);
        }
        return Array.isArray(type.value)
          ? type.value.map((v: any) => v && v.value && v.value.toString()).join(' | ')
          : JSON.stringify(type);
      case 'instanceOf':
        return `instanceOf(${JSON.stringify(type.value)})`;
      default:
        return type.name;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    return 'unknown';
  }
}

export function enhancePropTypesProp(extractedProp: ExtractedProp): PropDef {
  const { propDef, docgenInfo } = extractedProp;

  propDef.type = extractType(docgenInfo.type, extractedProp);

  return propDef;
}
