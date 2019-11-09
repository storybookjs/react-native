/* eslint-disable no-underscore-dangle */
import { PropDef, PropsTableProps } from '@storybook/components';
import { Component } from '../blocks/shared';
import { getTypeSystemHandler, getPropTypeSystem } from './type-system-handlers';

export type PropsExtractor = (component: Component) => PropsTableProps | null;

export type PropDefGetter = (component: Component, section: string) => PropDef[];

export const str = (o: any) => {
  if (!o) {
    return '';
  }
  if (typeof o === 'string') {
    return o as string;
  }
  throw new Error(`Description: expected string, got: ${JSON.stringify(o)}`);
};

export const hasDocgen = (component: Component) => !!component.__docgenInfo;

export const hasDocgenSection = (component: Component, section: string) =>
  component &&
  component.__docgenInfo &&
  component.__docgenInfo[section] &&
  Object.keys(component.__docgenInfo[section]).length > 0;

export const extractPropsFromDocgen: PropDefGetter = (component, section) => {
  if (!hasDocgenSection(component, section)) {
    return [];
  }

  const props: Record<string, PropDef> = {};
  const docgenInfoProps = component.__docgenInfo[section];
  const propKeys = Object.keys(docgenInfoProps);

  // Assuming the props for a given component will all have the same type system.
  const typeSystem = getPropTypeSystem(docgenInfoProps[propKeys[0]]);
  const typeSystemHandler = getTypeSystemHandler(typeSystem);

  propKeys.forEach(propKey => {
    const docgenInfoProp = docgenInfoProps[propKey];

    const result = typeSystemHandler(propKey, docgenInfoProp);

    if (!result.ignore) {
      props[propKey] = result.propDef;
    }
  });

  return Object.values(props);
};

export const extractComponentDescription = (component?: Component) =>
  component && component.__docgenInfo && str(component.__docgenInfo.description);
