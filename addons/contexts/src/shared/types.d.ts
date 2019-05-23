import { ComponentProps, FunctionComponent } from 'react';
import { Icons } from '@storybook/components';

export { API as ManagerAPI } from '@storybook/api';

// helpers
export declare type AnyFunctionReturns<T> = (...arg: any[]) => T;
export declare type FCNoChildren<P> = FunctionComponent<{ children?: never } & P>;
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type GenericProp = null | {
  [key: string]: unknown;
};

// interfaces
export declare interface AddonOptions {
  deep?: boolean;
  disable?: boolean;
  cancelable?: boolean;
}

export declare interface AddonSetting {
  icon?: ComponentProps<typeof Icons>['icon'] | '';
  title: string;
  components?: unknown[];
  params?: {
    name: string;
    props: GenericProp;
    default?: boolean;
  }[];
  options?: AddonOptions;
}

export declare interface ContextNode extends Required<AddonSetting> {
  nodeId: string;
  options: Required<AddonOptions>;
}

export declare interface SelectionState {
  readonly [key: string]: string;
}

export declare interface PropsMap {
  readonly [key: string]: GenericProp;
}

export declare interface WrapperSettings {
  options?: AddonSetting[];
  // `parameters` can be set to `false` to disable the addon
  parameters?: AddonSetting[] | false;
}
