/* eslint-disable no-underscore-dangle */

import { PropSummaryValue, PropDef } from '@storybook/components';
import { Component } from '../../../blocks/shared';
import { extractPropsFromDocgen } from '../../../lib/docgen';
import { enhancePropTypesProp } from './handleProp';

const DOCGEN_SECTION = 'props';
const PROP_NAME = 'propName';

function createComponent(docgenInfo: Record<string, any>): Component {
  const component = () => {};
  // @ts-ignore
  component.__docgenInfo = {
    [DOCGEN_SECTION]: {
      [PROP_NAME]: {
        required: false,
        ...docgenInfo,
      },
    },
  };

  return component;
}

function extractPropDef(component: Component): PropDef {
  return enhancePropTypesProp(extractPropsFromDocgen(component, DOCGEN_SECTION)[0]);
}

describe('prop type', () => {
  describe('custom', () => {
    it("should render raw value when it's available", () => {
      const component = createComponent({
        type: {
          name: 'custom',
          raw: 'MY_TYPE',
        },
      });

      const propDef = extractPropDef(component);
      const type = propDef.type as PropSummaryValue;

      expect(type.summary).toBe('MY_TYPE');
      expect(type.detail).toBeUndefined();
    });
  });
});
