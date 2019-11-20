import { PropsTableProps } from '@storybook/components';
import { Component } from '../../blocks/shared';

export type PropsExtractor = (component: Component) => PropsTableProps | null;

export interface DocgenBaseType {
  name: string;
  description?: string;
  require?: boolean;
}

export interface DocgenPropType extends DocgenBaseType {
  value?: any;
  raw?: string;
  computed?: boolean;
}

export interface DocgenFlowType extends DocgenBaseType {
  type?: string;
  raw?: string;
  signature?: any;
  elements?: any[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DocgenTypeScriptType extends DocgenBaseType {}

export type DocgenType = DocgenPropType | DocgenFlowType | DocgenTypeScriptType;

export interface DocgenPropDefaultValue {
  value: string;
}

export interface DocgenInfo {
  type?: DocgenPropType;
  flowType?: DocgenFlowType;
  tsType?: DocgenTypeScriptType;
  required: boolean;
  description?: string;
  defaultValue?: DocgenPropDefaultValue;
}

export enum TypeSystem {
  JAVASCRIPT = 'JavaScript',
  FLOW = 'Flow',
  TYPESCRIPT = 'TypeScript',
  UNKNOWN = 'Unknown',
}
