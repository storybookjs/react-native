import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { Component } from '../../blocks/shared';
import { ExtractedJsDoc, parseJsDoc } from '../jsdocParser';
import { DocgenInfo, TypeSystem } from './types';
import { getDocgenSection, isValidDocgenSection } from './utils';
import { getPropDefFactory, PropDefFactory } from './createPropDef';

export interface ExtractedProp {
  propDef: PropDef;
  docgenInfo: DocgenInfo;
  jsDocTags: ExtractedJsDoc;
  typeSystem: TypeSystem;
}

export type ExtractProps = (component: Component, section: string) => ExtractedProp[];

const getTypeSystem = (docgenInfo: DocgenInfo): TypeSystem => {
  if (!isNil(docgenInfo.type)) {
    return TypeSystem.JAVASCRIPT;
  }

  if (!isNil(docgenInfo.flowType)) {
    return TypeSystem.FLOW;
  }

  if (!isNil(docgenInfo.tsType)) {
    return TypeSystem.TYPESCRIPT;
  }

  return TypeSystem.UNKNOWN;
};

export const extractPropsFromDocgen: ExtractProps = (component, section) => {
  const docgenSection = getDocgenSection(component, section);

  if (!isValidDocgenSection(docgenSection)) {
    return [];
  }

  const docgenPropsKeys = Object.keys(docgenSection);
  const typeSystem = getTypeSystem(docgenSection[docgenPropsKeys[0]]);
  const createPropDef = getPropDefFactory(typeSystem);

  return docgenPropsKeys
    .map(propName => {
      const docgenInfo = docgenSection[propName];

      return !isNil(docgenInfo)
        ? extractProp(propName, docgenInfo, typeSystem, createPropDef)
        : null;
    })
    .filter(x => x);
};

function extractProp(
  propName: string,
  docgenInfo: DocgenInfo,
  typeSystem: TypeSystem,
  createPropDef: PropDefFactory
): ExtractedProp {
  const jsDocParsingResult = parseJsDoc(docgenInfo.description);
  const isIgnored = jsDocParsingResult.includesJsDoc && jsDocParsingResult.ignore;

  if (!isIgnored) {
    const propDef = createPropDef(propName, docgenInfo, jsDocParsingResult);

    return {
      propDef,
      jsDocTags: jsDocParsingResult.extractedTags,
      docgenInfo,
      typeSystem,
    };
  }

  return null;
}
