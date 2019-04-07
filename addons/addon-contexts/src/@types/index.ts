export * from './manager';
export * from './preview';

// helpers
export declare type AnyFunctionReturns<T> = (...args: any[]) => T;
export declare type GenericObject = { [key: string]: GenericObject };
export declare type GenericProp = GenericObject | null;
export declare type StringTuple = [string, string];
export declare type StringObject = { [key: string]: string };
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// shapes
export declare type AddonOptions = {
  deep?: boolean;
  disable?: boolean;
  cancelable?: boolean;
};

export declare type AddonSetting = {
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

export declare type ContextNode = Required<AddonSetting> & {
  nodeId: string;
};

// wrappers
export declare type WrapperSettings = {
  options: AddonSetting[] | undefined;
  parameters?: AddonSetting[] | undefined;
};

export declare type Wrapper = (
  ...args: [AnyFunctionReturns<unknown>, unknown, WrapperSettings]
) => unknown;

export declare type WithContexts = (contexts: AddonSetting[]) => unknown;
