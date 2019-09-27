import React from 'react';
import { PropsTable, PropsTableError, PropsTableProps, PropDef } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { Component, CURRENT_SELECTION } from './shared';
import { getPropDefs as autoPropDefs, PropDefGetter } from '../lib/getPropDefs';

interface PropsProps {
  exclude?: string[];
  of: '.' | Component;
}

const inferPropDefs = (framework: string): PropDefGetter | null => {
  switch (framework) {
    case 'react':
    case 'vue':
      return autoPropDefs;
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

    const { getPropDefs = inferPropDefs(framework) } = params.docs || {};
    if (!getPropDefs) {
      throw new Error(PropsTableError.PROPS_UNSUPPORTED);
    }
    const allRows = getPropDefs(target);
    const rows = !exclude ? allRows : allRows.filter((row: PropDef) => !exclude.includes(row.name));
    return { rows };
  } catch (err) {
    return { error: err.message };
  }
};

const PropsContainer: React.FunctionComponent<PropsProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const propsTableProps = getPropsTableProps(props, context);
      return <PropsTable {...propsTableProps} />;
    }}
  </DocsContext.Consumer>
);

export { PropsContainer as Props };
