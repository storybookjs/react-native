import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';
import { TypeSystem, DocgenInfo } from './types';
import { JsDocParsingResult } from './jsdocParser';

export type PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => PropDef;

function createDefaultPropDef(name: string, type: string, docgenInfo: DocgenInfo): PropDef {
  const { description, required, defaultValue } = docgenInfo;

  return {
    name,
    type,
    required,
    description,
    defaultValue: isNil(defaultValue) ? null : defaultValue.value,
  };
}

function createPropDef(
  name: string,
  type: string,
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
        params: hasParams && extractedTags.params.map(x => x.raw),
        returns: hasReturns && extractedTags.returns.raw,
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
  return createPropDef(propName, docgenInfo.type.name, docgenInfo, jsDocParsingResult);
};

export const tsFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createPropDef(propName, docgenInfo.tsType.name, docgenInfo, jsDocParsingResult);
};

export const flowFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createPropDef(propName, docgenInfo.flowType.name, docgenInfo, jsDocParsingResult);
};

export const unknownFactory: PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => {
  return createPropDef(propName, 'unknown', docgenInfo, jsDocParsingResult);
};

export const Factories: Record<TypeSystem, PropDefFactory> = {
  [TypeSystem.JavaScript]: javaScriptFactory,
  [TypeSystem.Flow]: flowFactory,
  [TypeSystem.TypeScript]: tsFactory,
  [TypeSystem.Unknown]: unknownFactory,
};

const getTypeSystem = (docgenInfo: DocgenInfo): TypeSystem => {
  if (!isNil(docgenInfo.type)) {
    return TypeSystem.JavaScript;
  }

  if (!isNil(docgenInfo.flowType)) {
    return TypeSystem.Flow;
  }

  if (!isNil(docgenInfo.tsType)) {
    return TypeSystem.TypeScript;
  }

  return TypeSystem.Unknown;
};

export const getPropDefFactory = (docgenInfo: DocgenInfo): PropDefFactory => {
  const typeSystem = getTypeSystem(docgenInfo);

  return Factories[typeSystem];
};
