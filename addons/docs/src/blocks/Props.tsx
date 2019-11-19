import React, { FunctionComponent, useContext } from 'react';
import { PropsTable, PropsTableError, PropsTableProps, TabsState } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { Component, PropsSlot, CURRENT_SELECTION } from './shared';

import { PropsExtractor } from '../lib/docgen/types';
import { extractProps as reactExtractProps } from '../frameworks/react/extractProps';
import { extractProps as vueExtractProps } from '../frameworks/vue/extractProps';

interface PropsProps {
  exclude?: string[];
  of?: '.' | Component;
  components?: {
    [label: string]: Component;
  };
  slot?: PropsSlot;
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

export const getComponentProps = (
  component: Component,
  { exclude }: PropsProps,
  { parameters }: DocsContextProps
): PropsTableProps => {
  if (!component) {
    return null;
  }
  try {
    const params = parameters || {};
    const { framework = null } = params;

    const { extractProps = inferPropsExtractor(framework) } = params.docs || {};
    if (!extractProps) {
      throw new Error(PropsTableError.PROPS_UNSUPPORTED);
    }
    return extractProps(component, { exclude });
  } catch (err) {
    return { error: err.message };
  }
};

export const getComponent = (props: PropsProps = {}, context: DocsContextProps): Component => {
  const { of } = props;
  const { parameters = {} } = context;
  const { component } = parameters;

  const target = of === CURRENT_SELECTION ? component : of;
  if (!target) {
    if (of === CURRENT_SELECTION) {
      return null;
    }
    throw new Error(PropsTableError.NO_COMPONENT);
  }
  return target;
};

const PropsContainer: FunctionComponent<PropsProps> = props => {
  const context = useContext(DocsContext);
  const { slot, components } = props;
  const {
    parameters: { components: parametersComponents },
  } = context;
  const subComponents = components || parametersComponents;
  if (!subComponents || typeof subComponents !== 'object') {
    const main = getComponent(props, context);
    const mainProps = slot ? slot(context, main) : getComponentProps(main, props, context);
    return mainProps && <PropsTable {...mainProps} />;
  }

  const subProps: { label: string; table: PropsTableProps }[] = Object.keys(subComponents).map(
    label => {
      const component = subComponents[label];
      return {
        label,
        table: slot ? slot(context, component) : getComponentProps(component, props, context),
      };
    }
  );

  return (
    <TabsState>
      {subProps.map(item => {
        const { label, table } = item;
        if (!table) {
          return null;
        }
        return (
          <div key={`prop_table_div_${label}`} id={label} title={label}>
            {({ active }: { active: boolean }) =>
              active ? <PropsTable key={`prop_table_${label}`} {...table} /> : null
            }
          </div>
        );
      })}
    </TabsState>
  );
};

PropsContainer.defaultProps = {
  of: '.',
};

export { PropsContainer as Props };
