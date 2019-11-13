/* eslint-disable no-underscore-dangle */
import { PropDef, PropsTableProps } from '@storybook/components';
import { Component } from '../blocks/shared';

export type PropsExtractor = (component: Component) => PropsTableProps | null;

export type PropDefGetter = (component: Component, section: string) => PropDef[];

export const hasDocgen = (component: Component) => !!component.__docgenInfo;

export const extractPropsFromDocgen: PropDefGetter = (component, section) => {
  return [];
};
