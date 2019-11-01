import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';
import { parseJsDoc } from './jsdoc-parser';

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

export type TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => PropDef;

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

export const propTypesHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);

  // Take a default type value from docgen. It will be overrided later if something better can be infered from JSDoc tags.
  propDef.type = docgenInfo.type;

  if (propMightContainsJsDoc(propDef)) {
    const parsingResult = parseJsDoc(propDef, { inferType: true });

    if (!isNil(parsingResult.type)) {
      propDef.type = parsingResult.type;
    }

    if (!isNil(parsingResult.description)) {
      propDef.description = parsingResult.description;
    }

    if (!isNil(parsingResult.tags)) {
      propDef.jsDocTags = parsingResult.tags;
    }
  }

  return propDef;
};

export const tsHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = docgenInfo.tsType;

  if (propMightContainsJsDoc(propDef)) {
    const parsingResult = parseJsDoc(propDef);

    if (!isNil(parsingResult.description)) {
      propDef.description = parsingResult.description;
    }

    if (!isNil(parsingResult.tags)) {
      propDef.jsDocTags = parsingResult.tags;
    }
  }

  return propDef;
};

export const flowHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = docgenInfo.flowType;

  return propDef;
};

export const unknownHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = { name: 'unknown' };

  return propDef;
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
