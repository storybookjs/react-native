import { PropsTableProps } from '@storybook/components';
import { Component } from '../blocks/shared';

export type PropsExtractor = (component: Component) => PropsTableProps | null;

// export type PropDefGetter = (component: Component, section: string) => PropDef[];

export interface DocgenInfo {
  type?: {
    name: string;
    value?: {
      name?: string;
      raw?: string;
    };
  };
  flowType?: {
    name: string;
  };
  tsType?: {
    name: string;
  };
  required: boolean;
  description?: string;
  defaultValue?: {
    value: string;
  };
}

export enum TypeSystem {
  JavaScript = 'JavaScript',
  Flow = 'Flow',
  TypeScript = 'TypeScript',
  Unknown = 'Unknown',
}
