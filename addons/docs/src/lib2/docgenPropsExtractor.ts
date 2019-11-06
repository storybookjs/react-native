import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';
import { Component } from '../blocks/shared';
import { ExtractedJsDocTags, parseJsDoc } from './jsdocParser';
import { DocgenInfo } from './types';
import { getDocgenSection, isValidDocgenSection } from './docgenUtils';
import { getPropDefFactory } from './createPropDef';

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

  const extractedProps: ExtractedProp[] = [];
  const docgenPropsKeys = Object.keys(docgenSection);
  const createPropDef = getPropDefFactory(docgenSection[docgenPropsKeys[0]]);

  docgenPropsKeys.forEach(propName => {
    const docgenInfo = docgenSection[propName];

    if (!isNil(docgenInfo)) {
      const jsDocParsingResult = parseJsDoc(docgenInfo);
      const isIgnored = jsDocParsingResult.propHasJsDoc && jsDocParsingResult.ignore;

      if (!isIgnored) {
        const propDef = createPropDef(propName, docgenInfo, jsDocParsingResult);

        extractedProps.push({
          propDef,
          jsDocTags: jsDocParsingResult.extractedTags,
          docgenInfo,
        });
      }
    }
  });

  return extractedProps;
};
