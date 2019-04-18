export * from './manager';
export * from './preview';

// helpers
export type AnyFunctionReturns<T> = (...arg: any[]) => T;
export interface GenericObject {
  [key: string]: GenericObject;
}
export type GenericProp = GenericObject | null;
export type StringTuple = [string, string];
export interface StringObject {
  [key: string]: string;
}
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// shapes
export interface AddonOptions {
  deep?: boolean;
  disable?: boolean;
  cancelable?: boolean;
}

export interface AddonSetting {
  icon?: string;
  title: string;
  components?: unknown[];
  params?: Array<{
    name: string;
    props: GenericProp;
    default?: boolean;
  }>;
  options?: AddonOptions;
}

export type ContextNode = Required<AddonSetting> & {
  nodeId: string;
};

// wrappers
export interface WrapperSettings {
  options: Array<Partial<AddonSetting>> | undefined;

  /**
   * Although parameters could be an object for disable this addon (i.e. { contexts: false }),
   * we are not bother on typing it since the logic is out of the scope here.
   */
  parameters?: Array<Partial<AddonSetting>>;
}

export type Wrapper = (...arg: [AnyFunctionReturns<any>, unknown, WrapperSettings]) => unknown;

export type Renderer = (
  nodes: ContextNode[],
  props: GenericObject,
  next: AnyFunctionReturns<unknown>
) => unknown;

export type CreateAddonDecorator = (render: Renderer) => (contexts: AddonSetting[]) => unknown;
