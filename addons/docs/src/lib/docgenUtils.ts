/* eslint-disable no-underscore-dangle */
import { PropDef, PropsTableProps } from '@storybook/components';
import { Component } from '../blocks/shared';

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

export const extractPropsFromDocgen: PropDefGetter = (component, section) => {
  return [];
};

export const extractComponentDescription = (component?: Component) =>
  component && component.__docgenInfo && str(component.__docgenInfo.description);
