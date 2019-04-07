import {
  AddonOptions,
  AddonSetting,
  AnyFunctionReturns,
  ContextNode,
  GenericObject,
  GenericProp,
  StringObject,
  WrapperSettings,
} from './index';

export type Memorize = <T, U extends any[]>(
  fn: (...args: U) => T,
  resolver?: (...args: U) => unknown
) => (...args: U) => T;

export type Singleton = <T, U extends any[]>(fn: (...args: U) => T) => (...args: U) => T;

export type AggregateComponents = <T>(
  h: AnyFunctionReturns<T>
) => (
  ...args: [ContextNode['components'], GenericProp, AddonOptions, number]
) => AnyFunctionReturns<T>;

export type AggregateContexts = <T>(
  h: AnyFunctionReturns<T>
) => (...args: [ContextNode[], GenericObject, AnyFunctionReturns<any>]) => T;

export type GetMergedSettings = (
  ...args: [Partial<AddonSetting>, Partial<AddonSetting>]
) => ContextNode;

export type GetContextNodes = (settings: WrapperSettings) => ContextNode[];

export type GetPropsByParamName = (params: ContextNode['params'], name?: string) => GenericProp;

export type GetPropsMap = (nodes: ContextNode[], state: StringObject) => GenericObject;
