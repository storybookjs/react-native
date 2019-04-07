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

export declare type Memorize = <T, U extends any[]>(
  fn: (...args: U) => T,
  resolver?: (...args: U) => unknown
) => (...args: U) => T;

export declare type Singleton = <T, U extends any[]>(fn: (...args: U) => T) => (...args: U) => T;

export declare type AggregateComponents = <T>(
  h: AnyFunctionReturns<T>
) => (
  ...args: [ContextNode['components'], GenericProp, AddonOptions, number]
) => AnyFunctionReturns<T>;

export declare type AggregateContexts = <T>(
  h: AnyFunctionReturns<T>
) => (...args: [ContextNode[], GenericObject, AnyFunctionReturns<any>]) => T;

export declare type GetMergedSettings = (
  ...args: [Partial<AddonSetting>, Partial<AddonSetting>]
) => ContextNode;

export declare type GetContextNodes = (settings: WrapperSettings) => ContextNode[];

export declare type GetPropsByParamName = (
  params: ContextNode['params'],
  name?: string
) => GenericProp;
export declare type GetPropsMap = (nodes: ContextNode[], state: StringObject) => GenericObject;
