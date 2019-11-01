/* eslint-disable no-underscore-dangle */
import { PropDef, PropsTableProps } from '@storybook/components';
import { Component } from '../blocks/shared';
import { getTypeSystemHandler, getPropTypeSystem } from './type-system-handlers';

export type PropsExtractor = (component: Component) => PropsTableProps | null;

export type PropDefGetter = (type: Component, section: string) => PropDef[];

export const str = (o: any) => {
  if (!o) {
    return '';
  }
  if (typeof o === 'string') {
    return o as string;
  }
  throw new Error(`Description: expected string, got: ${JSON.stringify(o)}`);
};

export const hasDocgen = (obj: any) => !!obj.__docgenInfo;

export const hasDocgenSection = (obj: any, section: string) =>
  obj.__docgenInfo &&
  obj.__docgenInfo[section] &&
  Object.keys(obj.__docgenInfo[section]).length > 0;

export const extractPropsFromDocgen: PropDefGetter = (type, section) => {
  const props: Record<string, PropDef> = {};

  const docgenInfoProps = type.__docgenInfo[section];
  if (!docgenInfoProps) {
    return [];
  }

  const propKeys = Object.keys(docgenInfoProps);
  if (propKeys.length === 0) {
    return [];
  }

  // Assuming the props for a given type will all have the same type system.
  const typeSystem = getPropTypeSystem(docgenInfoProps[propKeys[0]]);
  const typeSystemHandler = getTypeSystemHandler(typeSystem);

  propKeys.forEach(propKey => {
    const docgenInfoProp = docgenInfoProps[propKey];

    const propDef = typeSystemHandler(propKey, docgenInfoProp);
    props[propKey] = propDef;
  });

  return Object.values(props);
};

export const extractComponentDescription = (component?: Component) =>
  component && component.__docgenInfo && str(component.__docgenInfo.description);
