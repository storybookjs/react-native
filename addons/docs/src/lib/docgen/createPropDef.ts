import { isNil } from 'lodash';
import { PropDef, PropDefaultValue } from '@storybook/components';
import { TypeSystem, DocgenInfo, DocgenType, DocgenPropDefaultValue } from './types';
import { JsDocParsingResult } from '../jsdocParser';
import { createSummaryValue } from '../utils';
import { createFlowPropDef } from './flow/createPropDef';
import { isDefaultValueBlacklisted } from './utils/defaultValue';
import { createTsPropDef } from './typeScript/createPropDef';

export type PropDefFactory = (
  propName: string,
  docgenInfo: DocgenInfo,
  jsDocParsingResult?: JsDocParsingResult
) => PropDef;

function createType(type: DocgenType) {
  // A type could be null if a defaultProp has been provided without a type definition.
  return !isNil(type) ? createSummaryValue(type.name) : null;
}

function createDefaultValue(defaultValue: DocgenPropDefaultValue): PropDefaultValue {
  if (!isNil(defaultValue)) {
    const { value } = defaultValue;

    if (!isDefaultValueBlacklisted(value)) {
      return createSummaryValue(value);
    }
  }

  return null;
}

function createBasicPropDef(name: string, type: DocgenType, docgenInfo: DocgenInfo): PropDef {
  const { description, required, defaultValue } = docgenInfo;

  return {
    name,
    type: createType(type),
    required,
    description,
    defaultValue: createDefaultValue(defaultValue),
  };
}

function applyJsDocResult(propDef: PropDef, jsDocParsingResult: JsDocParsingResult): PropDef {
  if (jsDocParsingResult.includesJsDoc) {
    const { description, extractedTags } = jsDocParsingResult;

    if (!isNil(description)) {
      // eslint-disable-next-line no-param-reassign
      propDef.description = jsDocParsingResult.description;
    }

    const hasParams = !isNil(extractedTags.params);
    const hasReturns = !isNil(extractedTags.returns) && !isNil(extractedTags.returns.type);

    if (hasParams || hasReturns) {
      // eslint-disable-next-line no-param-reassign
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

export const javaScriptFactory: PropDefFactory = (propName, docgenInfo, jsDocParsingResult) => {
  const propDef = createBasicPropDef(propName, docgenInfo.type, docgenInfo);

  return applyJsDocResult(propDef, jsDocParsingResult);
};

export const tsFactory: PropDefFactory = (propName, docgenInfo, jsDocParsingResult) => {
  const propDef = createTsPropDef(propName, docgenInfo);

  return applyJsDocResult(propDef, jsDocParsingResult);
};

export const flowFactory: PropDefFactory = (propName, docgenInfo, jsDocParsingResult) => {
  const propDef = createFlowPropDef(propName, docgenInfo);

  return applyJsDocResult(propDef, jsDocParsingResult);
};

export const unknownFactory: PropDefFactory = (propName, docgenInfo, jsDocParsingResult) => {
  const propDef = createBasicPropDef(propName, { name: 'unknown' }, docgenInfo);

  return applyJsDocResult(propDef, jsDocParsingResult);
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
