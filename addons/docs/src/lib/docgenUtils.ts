/* eslint-disable no-underscore-dangle */
import { PropDef, PropsTableProps } from '@storybook/components';
import { Component } from '../blocks/shared';

export type PropsExtractor = (component: Component) => PropsTableProps | null;

export type PropDefGetter = (type: Component, section: string) => PropDef[] | null;

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

export const propsFromDocgen: PropDefGetter = (type, section) => {
  const props: Record<string, PropDef> = {};
  const docgenInfoProps = type.__docgenInfo[section];
  if (!docgenInfoProps) {
    return null;
  }

  Object.keys(docgenInfoProps).forEach(property => {
    const docgenInfoProp = docgenInfoProps[property];
    const defaultValueDesc = docgenInfoProp.defaultValue || {};
    const propType = docgenInfoProp.flowType || docgenInfoProp.type || 'other';

    props[property] = {
      name: property,
      type: propType,
      required: docgenInfoProp.required,
      description: docgenInfoProp.description,
      defaultValue: defaultValueDesc.value,
    };
  });

  return Object.values(props);
};

export const extractComponentDescription = (component?: Component) =>
  component && component.__docgenInfo && str(component.__docgenInfo.description);
