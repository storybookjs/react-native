import { Component } from 'vue';

export * from './manager';
export * from './preview';

// helpers
export type AnyFunctionReturns<T> = (...arg: any[]) => T;
export type GenericObject = { [key: string]: GenericObject };
export type GenericProp = GenericObject | null;
export type StringTuple = [string, string];
export type StringObject = { [key: string]: string };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// shapes
export type AddonOptions = {
  deep?: boolean;
  disable?: boolean;
  cancelable?: boolean;
};

export type AddonSetting = {
  icon?: string;
  title: string;
  components?: unknown[];
  params?: {
    name: string;
    props: GenericProp;
    default?: boolean;
  }[];
  options?: AddonOptions;
};

export type ContextNode = Required<AddonSetting> & {
  nodeId: string;
};

// wrappers
export type WrapperSettings = {
  options: AddonSetting[] | undefined;
  parameters?: AddonSetting[] | undefined;
};

export type Wrapper = (...arg: [AnyFunctionReturns<any>, unknown, WrapperSettings]) => unknown;

export type Renderer = (
  nodes: ContextNode[],
  props: GenericObject,
  next: AnyFunctionReturns<unknown>
) => Component;

export type GetAddonDecorator = (render: Renderer) => (contexts: AddonSetting[]) => unknown;
