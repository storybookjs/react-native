import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';
import { Component } from '../blocks/shared';
import { ExtractedJsDocTags, parseJsDoc } from './jsdocParser';
import { DocgenInfo } from './types';
import { getDocgenSection, isValidDocgenSection } from './docgenUtils';
import { getPropDefFactory, PropDefFactory } from './createPropDef';

export interface ExtractedProp {
  propDef: PropDef;
  jsDocTags: ExtractedJsDocTags;
  docgenInfo: DocgenInfo;
}

export type ExtractProps = (component: Component, section: string) => ExtractedProp[];

export const extractPropsFromDocgen: ExtractProps = (component, section) => {
  const docgenSection = getDocgenSection(component, section);

  if (!isValidDocgenSection(docgenSection)) {
    return [];
  }

  const docgenPropsKeys = Object.keys(docgenSection);
  const createPropDef = getPropDefFactory(docgenSection[docgenPropsKeys[0]]);

  return docgenPropsKeys
    .map(propName => {
      const docgenInfo = docgenSection[propName];

      return !isNil(docgenInfo) ? extractProp(propName, docgenInfo, createPropDef) : null;
    })
    .filter(x => x);
};

export function extractProp(
  propName: string,
  docgenInfo: DocgenInfo,
  createPropDef: PropDefFactory
): ExtractedProp {
  const jsDocParsingResult = parseJsDoc(docgenInfo);
  const isIgnored = jsDocParsingResult.propHasJsDoc && jsDocParsingResult.ignore;

  if (!isIgnored) {
    const propDef = createPropDef(propName, docgenInfo, jsDocParsingResult);

    return {
      propDef,
      jsDocTags: jsDocParsingResult.extractedTags,
      docgenInfo,
    };
  }

  return null;
}
