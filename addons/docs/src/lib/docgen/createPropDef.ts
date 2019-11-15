import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { TypeSystem, DocgenInfo, DocgenType } from './types';
import { JsDocParsingResult } from '../jsdocParser';
import { createDefaultValue } from './createDefaultValue';

export type PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => PropDef;

function createBasicPropDef(name: string, type: DocgenType, docgenInfo: DocgenInfo): PropDef {
  const { description, required, defaultValue } = docgenInfo;

  return {
    name,
    type: { summary: type.name },
    required,
    description,
    defaultValue: createDefaultValue(defaultValue),
  };
}

function createPropDef(
  name: string,
  type: DocgenType,
  docgenInfo: DocgenInfo,
  jsDocParsingResult: JsDocParsingResult
): PropDef {
  const propDef = createBasicPropDef(name, type, docgenInfo);

  if (jsDocParsingResult.includesJsDoc) {
    const { description, extractedTags } = jsDocParsingResult;

    if (!isNil(description)) {
      propDef.description = jsDocParsingResult.description;
    }

    const hasParams = !isNil(extractedTags.params);
    const hasReturns = !isNil(extractedTags.returns) && !isNil(extractedTags.returns.type);

    if (hasParams || hasReturns) {
      propDef.jsDocTags = {
        params:
          hasParams &&
          extractedTags.params.map(x => ({ name: x.getPrettyName(), description: x.description })),
        returns: hasReturns && { description: extractedTags.returns.description },
      };
    }
  }

  return propDef;
}

export const javaScriptFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createPropDef(propName, docgenInfo.type, docgenInfo, jsDocParsingResult);
};

export const tsFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createPropDef(propName, docgenInfo.tsType, docgenInfo, jsDocParsingResult);
};

export const flowFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createPropDef(propName, docgenInfo.flowType, docgenInfo, jsDocParsingResult);
};

export const unknownFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createPropDef(propName, { name: 'unknown' }, docgenInfo, jsDocParsingResult);
};

export const getPropDefFactory = (typeSystem: TypeSystem): PropDefFactory => {
  switch (typeSystem) {
    case TypeSystem.JAVASCRIPT:
      return javaScriptFactory;
    case TypeSystem.TYPESCRIPT:
      return tsFactory;
    case TypeSystem.FLOW:
      return flowFactory;
    default:
      return unknownFactory;
  }
};
