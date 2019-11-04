import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';
import {
  parseJsDoc,
  JsDocParsingOptions,
  ExtractedJsDocTags,
  ExtractedJsDocParamTag,
  PropTypeHandler,
  PropTypeHandlerContext,
} from './jsdoc-parser';

export interface DocgenInfo {
  type?: {
    name: string;
  };
  flowType?: any;
  tsType?: any;
  required: boolean;
  description?: string;
  defaultValue?: {
    value: string;
  };
}

export const TypeSystem = {
  Flow: 'Flow',
  TypeScript: 'TypeScript',
  PropTypes: 'PropTypes',
  Unknown: 'Unknown',
};

export interface TypeSystemHandlerResult {
  propDef?: PropDef;
  ignore: boolean;
}

export type TypeSystemHandler = (
  propName: string,
  docgenInfo: DocgenInfo
) => TypeSystemHandlerResult;

function createDefaultPropDef(propName: string, docgenInfo: DocgenInfo): PropDef {
  const { description, required, defaultValue } = docgenInfo;

  return {
    name: propName,
    type: null,
    required,
    description,
    defaultValue: isNil(defaultValue) ? null : defaultValue.value,
  };
}

function propMightContainsJsDoc(propDef: PropDef): boolean {
  return !isNil(propDef.description) && propDef.description.includes('@');
}

function handleProp(propDef: PropDef, options?: JsDocParsingOptions) {
  if (propMightContainsJsDoc(propDef)) {
    const parsingResult = parseJsDoc(propDef, options);

    if (parsingResult.ignore) {
      return {
        ignore: true,
      };
    }

    Object.keys(parsingResult).forEach(propName => {
      if (propName !== 'ignore') {
        const propValue = parsingResult[propName];

        if (!isNil(propValue)) {
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          propDef[propName] = propValue;
        }
      }
    });
  }

  return {
    propDef,
    ignore: false,
  };
}

// When available use the proper JSDoc tags to describe the function signature instead of displaying "func".
const propTypesFuncHandler: PropTypeHandler = (
  propDef: PropDef,
  extractedTags: ExtractedJsDocTags,
  { hasParams, hasReturns }: PropTypeHandlerContext
) => {
  if (hasParams || hasReturns) {
    const funcParts = [];

    if (hasParams) {
      const funcParams = extractedTags.params.map((x: ExtractedJsDocParamTag) => {
        const typeName = x.getTypeName();

        if (!isNil(typeName)) {
          return `${x.name}: ${typeName}`;
        }

        return x.name;
      });

      funcParts.push(`(${funcParams.join(', ')})`);
    } else {
      funcParts.push('()');
    }

    if (hasReturns) {
      funcParts.push(`=> ${extractedTags.returns.getTypeName()}`);
    }

    return {
      type: {
        name: funcParts.join(' '),
      },
    };
  }

  return null;
};

export const propTypesHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = docgenInfo.type;

  return handleProp(propDef, {
    propTypeHandlers: {
      func: propTypesFuncHandler,
    },
  });
};

export const tsHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = docgenInfo.tsType;

  return handleProp(propDef);
};

export const flowHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = docgenInfo.flowType;

  return handleProp(propDef);
};

export const unknownHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = { name: 'unknown' };

  return handleProp(propDef);
};

export const TypeSystemHandlers: Record<string, TypeSystemHandler> = {
  [TypeSystem.Flow]: flowHandler,
  [TypeSystem.TypeScript]: tsHandler,
  [TypeSystem.PropTypes]: propTypesHandler,
  [TypeSystem.Unknown]: unknownHandler,
};

export const getPropTypeSystem = (docgenInfo: DocgenInfo): string => {
  if (!isNil(docgenInfo.flowType)) {
    return TypeSystem.Flow;
  }

  if (!isNil(docgenInfo.tsType)) {
    return TypeSystem.TypeScript;
  }

  if (!isNil(docgenInfo.type)) {
    return TypeSystem.PropTypes;
  }

  return TypeSystem.Unknown;
};

export const getTypeSystemHandler = (typeSystem: string): TypeSystemHandler => {
  return TypeSystemHandlers[typeSystem];
};
