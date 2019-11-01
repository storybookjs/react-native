import React, { FunctionComponent } from 'react';
import { PropsTable, PropsTableError, PropsTableProps } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { Component, CURRENT_SELECTION } from './shared';

import { PropsExtractor } from '../lib/docgenUtils';
import { extractProps as reactExtractProps } from '../frameworks/react/extractProps';
import { extractProps as vueExtractProps } from '../frameworks/vue/extractProps';

interface PropsProps {
  exclude?: string[];
  of: '.' | Component;
}

// FIXME: remove in SB6.0 & require config
const inferPropsExtractor = (framework: string): PropsExtractor | null => {
  switch (framework) {
    case 'react':
      return reactExtractProps;
    case 'vue':
      return vueExtractProps;
    default:
      return null;
  }
};

export const getPropsTableProps = (
  { exclude, of }: PropsProps,
  { parameters }: DocsContextProps
): PropsTableProps => {
  try {
    const params = parameters || {};
    const { component, framework = null } = params;

    const target = of === CURRENT_SELECTION ? component : of;
    if (!target) {
      throw new Error(PropsTableError.NO_COMPONENT);
    }

    const { extractProps = inferPropsExtractor(framework) } = params.docs || {};
    if (!extractProps) {
      throw new Error(PropsTableError.PROPS_UNSUPPORTED);
    }
    return extractProps(target, { exclude });
  } catch (err) {
    return { error: err.message };
  }
};

const PropsContainer: FunctionComponent<PropsProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const propsTableProps = getPropsTableProps(props, context);
      return <PropsTable {...propsTableProps} />;
    }}
  </DocsContext.Consumer>
);

export { PropsContainer as Props };
