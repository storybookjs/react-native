import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { TypeSystem, DocgenInfo } from './types';
import { JsDocParsingResult } from './jsdocParser';
import { createPropText } from './createComponents';
import { renderDefaultValue } from './renderDefaultValue';

export type PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => PropDef;

interface PropType {
  name: string;
}

function createDefaultPropDef(name: string, type: PropType, docgenInfo: DocgenInfo): PropDef {
  const { description, required, defaultValue } = docgenInfo;

  return {
    name,
    type: createPropText(type.name),
    required,
    description,
    defaultValue: renderDefaultValue(defaultValue, type),
    // defaultValue: isNil(defaultValue) ? null : defaultValue.value,
  };
}

function createDocgenPropDef(
  name: string,
  type: PropType,
  docgenInfo: DocgenInfo,
  jsDocParsingResult: JsDocParsingResult
): PropDef {
  const propDef = createDefaultPropDef(name, type, docgenInfo);

  if (jsDocParsingResult.propHasJsDoc) {
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
  return createDocgenPropDef(propName, docgenInfo.type, docgenInfo, jsDocParsingResult);
};

export const tsFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createDocgenPropDef(propName, docgenInfo.tsType, docgenInfo, jsDocParsingResult);
};

export const flowFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createDocgenPropDef(propName, docgenInfo.flowType, docgenInfo, jsDocParsingResult);
};

export const unknownFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createDocgenPropDef(propName, { name: 'unknown' }, docgenInfo, jsDocParsingResult);
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
